from django.db import models
from django.conf import settings
from apps.exams.models import Exam, Question, Option

class ExamAttempt(models.Model):
    """
    A specific instance of a user taking an exam.
    Ref: [cite: 109]
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) # [cite: 111]
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE) # [cite: 111]
    score = models.FloatField(null=True, blank=True) # [cite: 112]
    passed = models.BooleanField(null=True, blank=True) # [cite: 113]
    start_time = models.DateTimeField(auto_now_add=True) # [cite: 114]
    end_time = models.DateTimeField(null=True, blank=True) # [cite: 115]

class QuestionAttempt(models.Model):
    """
    Granular log of every interaction.
    Ref: [cite: 118]
    """
    exam_attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name='responses') # [cite: 119]
    question = models.ForeignKey(Question, on_delete=models.CASCADE) # [cite: 119]
    
    # ManyToMany because a user might select multiple options in a MULTI question
    selected_options = models.ManyToManyField(Option) # [cite: 120]
    
    is_correct = models.BooleanField(default=False) # [cite: 121]
    time_taken_seconds = models.IntegerField() #