from django.shortcuts import redirect, render
from .models import User, Feed, Comment
from django.urls import reverse

# Create your views here.
def comment(request, feed_id):
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user.username)
        feed = Feed.objects.get(pk=feed_id)

    if request.method == "POST":
        commentContent = request.POST.get("comment_content")

        comment = Comment(
            author=user,
            feed=feed,
            content=commentContent,
        )
        comment.save()
        return redirect("feed:show", feed_id=feed.id)
    return render(request, "feed/feed.html")
