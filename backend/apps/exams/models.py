from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Topic(models.Model):
    """
    Self-referential table for unlimited domain/subdomain nesting.
    Ref: [cite: 30]
    """
    name = models.CharField(max_length=200) # [cite: 32]
    slug = models.SlugField(unique=True, blank=True) # Added for URLs
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children'
    ) # [cite: 33]
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.parent.name} > {self.name}" if self.parent else self.name

class Question(models.Model):
    """
    The central question bank. 
    Ref: [cite: 66]
    """
    class QuestionTypes(models.TextChoices):
        SINGLE = "SINGLE", "Single Choice"
        MULTI = "MULTI", "Multiple Choice"
        TF = "TF", "True/False"

    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, related_name='questions') # [cite: 68]
    text = models.TextField() # [cite: 69]
    question_type = models.CharField(max_length=10, choices=QuestionTypes.choices) # [cite: 70]
    difficulty = models.IntegerField(choices=[(i, i) for i in range(1, 6)]) # [cite: 78]
    explanation = models.TextField(null=True, blank=True) # [cite: 79]
    is_active = models.BooleanField(default=True) # Added for soft delete
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]

class Option(models.Model):
    """
    Relational storage for options instead of JSON.
    Ref: [cite: 88]
    """
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options") # [cite: 90]
    text = models.CharField(max_length=500) # [cite: 91]
    is_correct = models.BooleanField(default=False) # [cite: 92]
    
    def __str__(self):
        return self.text

class Exam(models.Model):
    """
    The container for a test.
    Ref: [cite: 45]
    """
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) # [cite: 47]
    title = models.CharField(max_length=255) # [cite: 48]
    slug = models.SlugField(unique=True, blank=True) # Added for URLs
    description = models.TextField(blank=True)
    duration_minutes = models.IntegerField() # [cite: 49]
    is_active = models.BooleanField(default=True) # [cite: 50]
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Many-to-Many through a custom table to allow ordering/marks per exam
    questions = models.ManyToManyField(Question, through='ExamQuestion')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class ExamQuestion(models.Model):
    """
    Linking table. Allows the same question to be in multiple exams with different marks.
    Ref: [cite: 100]
    """
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    marks = models.FloatField(default=1.0) # [cite: 102]
    order = models.PositiveIntegerField(default=0) # Added for question sequencing

    class Meta:
        ordering = ['order']