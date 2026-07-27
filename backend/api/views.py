from pathlib import Path
from django.conf import settings
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
import PyPDF2
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UploadedPDF
from rest_framework import viewsets
from django.contrib.auth.models import User
from .serializer import UserSerializer, UploadListSerializer
from django.http import JsonResponse

def pdf_to_text(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        pages = [page.extract_text() for page in reader.pages]
    return '\n'.join(pages)

llm = ChatOllama(
    model="qwen2.5",
    base_url="http://ollama:11434"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def uploadpdf(request):
    if request.method != 'POST':
        return Response({'error': 'Method not allowed'}, status=405)

    uploaded_file = request.FILES.get('file')
    
    prompt = request.data.get('prompt')

    if not uploaded_file:
        return Response({'error': 'No file provided'}, status=400)

    if not prompt:
        return Response({'error': 'No prompt provided'}, status=400)

    upload_dir = Path(settings.BASE_DIR) / 'uploads'
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_name = Path(uploaded_file.name).name
    pdf_path = upload_dir / safe_name
    print(request.user)
    user = User.objects.get(username=request.user)
    u = UploadedPDF.objects.create(name=uploaded_file.name, user=user, file=uploaded_file)
    print(u)

    with open(pdf_path, 'wb+') as out_file:
        for chunk in uploaded_file.chunks():
            out_file.write(chunk)

    print("Saving PDF...")

    text = pdf_to_text(str(pdf_path))

    print("PDF extracted.")

    content = {
        'pdf_text': text,
        'prompt': prompt
    }


    prompt_template = PromptTemplate(
        input_variables=["pdf_text", "prompt"],
        template="{pdf_text}\n\n{prompt}"
    )

    response = llm.invoke(prompt_template.format(**content))

    print("LLM finished.")



    return Response({'response': response.content})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def uploadpdfList(request):
    if request.method != 'GET':
        return Response({'error': 'Method not allowed'}, status=405)
    

    pdf_info = UploadedPDF.objects.filter(user=request.user)
    
    new_data = UploadListSerializer(pdf_info, many=True)
        
   
   


    return Response(new_data.data)
        

class UserViewset(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]