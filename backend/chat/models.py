from django.db import models
from django.contrib.auth.models import User

class ChatRoom(models.Model):
    """
    Represents a 1-to-1 chat room between two users.
    """
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user2')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatRoom: {self.user1.username} and {self.user2.username}"

    class Meta:
        unique_together = ('user1', 'user2')  # Prevent duplicate rooms between two users


class Message(models.Model):
    """
    Represents a single message within a chat room.
    """
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()  # Message content
    is_read = models.BooleanField(default=False)  # Read receipt
    created_at = models.DateTimeField(auto_now_add=True)  # When the message was created
    updated_at = models.DateTimeField(auto_now=True)  # When the message was last updated
    status = models.CharField(
        max_length=10,
        choices=[('sent', 'Sent'), ('read', 'Read')],
        default='sent'
    )  # Status of the message

    def __str__(self):
        return f"Message from {self.sender.username} in ChatRoom {self.chat_room.id}"

    class Meta:
        ordering = ['created_at']  # Messages ordered by creation time
