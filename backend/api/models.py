from django.db import models
from django.contrib.auth.models import User

class UploadedPDF(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploaded_pdfs")
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="pdfs/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name if self.name else self.file.name

    @property
    def download_url(self):
        if self.file:
            return self.file.url
        return None