from django.shortcuts import render, redirect

from .models import User, Feed
from comment.models import Comment

# Create your views here.
def allFeeds(request):
    feeds = Feed.objects.all()
    comments = Comment.objects.all().order_by("-createdTime")
    return render(
        request,
        "feed/feeds.html",
        {
            "feeds": feeds,
            "comments": comments,
        },
    )


def show(request, feed_id):
    feed = Feed.objects.get(pk=feed_id)
    comments = Comment.objects.all().filter(feed_id=feed_id).order_by("-createdTime")
    return render(
        request,
        "feed/feed.html",
        {
            "feed": feed,
            "comments": comments,
        },
    )


def create(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)

        if request.method == "POST":
            title = request.POST["create_title"]
            content = request.POST["create_content"]

            feed = Feed(
                author=user,
                title=title,
                content=content,
            )

            feed.save()
            return redirect("feed:all_feeds")
        return render(request, "feed/create.html")
    else:
        return render(request, "user/login.html")


def edit(request, feed_id):
    if request.user.is_authenticated:
        feed = Feed.objects.get(pk=feed_id)
        test = Feed.objects.all().filter(author_id=request.user.id)

        if request.method == "POST":
            title = request.POST["title"]
            content = request.POST["content"]

            feed.title = title
            feed.content = content

            feed.save()
            return redirect("feed:all_feeds")
        return render(request, "feed/edit.html", {"feed": feed, "test": test})
    else:
        return render(request, "user/login.html")


def delete(request, feed_id):
    if request.user.is_authenticated:
        feed = Feed.objects.get(pk=feed_id)

        if request.method == "POST":
            feed.delete()
            return redirect("feed:all_feeds")
        return render(request, "feed/editFeed.html", {"feed": feed})
    else:
        return render(request, "user/login.html")
