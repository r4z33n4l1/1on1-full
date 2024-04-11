from django.urls import path
from .views import EventSchedulerView, AvailabilityDataView, FinalizedEventView, AddScheduleGroupView

urlpatterns = [
    path('create_event/', EventSchedulerView.as_view(), name='create_event'),
    path('create_schedule_group/', AddScheduleGroupView.as_view(), name='create_schedule_group'),
    path('availability_data/', AvailabilityDataView.as_view(), name='availability_data'),
    path('finalized_events/', FinalizedEventView.as_view(), name='finalized_events'),
]
