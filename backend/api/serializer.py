from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UploadedPDF

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']

class UploadListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedPDF
        fields = ['name']