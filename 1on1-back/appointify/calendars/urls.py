# calendars/urls.py

from django.urls import path
from .views import UserCalendarListView, UserCalendarCreateView, UserCalendarDeleteView, CalendarCreateView, UserCalendarUpdateView, CalendarUpdateView, UserCalendarsView, UserCalendarView

urlpatterns = [
    # user-calendar urls
    path('user-calendars/', UserCalendarListView.as_view(), name='user-calendar-list'),
    path('user-calendars/<int:cid>/create/', UserCalendarCreateView.as_view(), name='user-calendar-create'),
     path('user-calendars/<int:cid>/view/', UserCalendarView.as_view(), name='user-calendar-view'),
    path('user-calendars/<int:cid>/update/', UserCalendarUpdateView.as_view(), name='user-calendar-update'),
    path('user-calendars/<int:pk>/delete/', UserCalendarDeleteView.as_view(), name='user-calendar-delete'),

    # calendar urls
    path('all/', UserCalendarsView.as_view(), name='calendar-list'),
    path('create/', CalendarCreateView.as_view(), name='calendar-create'),
    path('update/<int:cid>/', CalendarUpdateView.as_view(), name='calendar-update'),
]
