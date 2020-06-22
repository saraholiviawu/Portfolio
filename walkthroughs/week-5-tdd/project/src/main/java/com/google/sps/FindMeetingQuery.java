// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.lang.Math;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    // Get request duration
    int requestDuration = (int) request.getDuration();

    // If requested duration is longer than one day, return no options as a valid time range.
    if (requestDuration > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    // Get required attendees
    Collection<String> attendees = request.getAttendees();

    // Get optional attendees
    Collection<String> optionalAttendees = request.getOptionalAttendees();

    // If no attendees or optional are requested, return the whole day as a valid time range.
    if (attendees.size() == 0 && optionalAttendees.size() == 0) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    // If only attendees are requested, return available time ranges for mandatory attendees.
    if (optionalAttendees.size() == 0) {
      ArrayList<TimeRange> availableTimeRanges = returnAvailableTimeRanges(events, attendees, requestDuration);
      return availableTimeRanges;
    }

    // If only optional attendees are requested, return available time ranges for optional attendees.
    if (attendees.size() == 0) {
      ArrayList<TimeRange> availableTimeRanges = returnAvailableTimeRanges(events, optionalAttendees, requestDuration);
      return availableTimeRanges;
    }

    // Else: Assume that both mandatory and optional attendees are requested.
    // Sort time ranges that attendees are busy for in ascending order by filtering through events.
    ArrayList<TimeRange> mandatoryAvailableTimeRanges = returnAvailableTimeRanges(events, attendees, requestDuration);
    ArrayList<TimeRange> optionalAvailableTimeRanges = returnAvailableTimeRanges(events, optionalAttendees, requestDuration);
    ArrayList<TimeRange> mutualAvailableTimeRanges = getMutualAvailableTimeRanges(mandatoryAvailableTimeRanges, optionalAvailableTimeRanges, requestDuration);
    if (mutualAvailableTimeRanges.size() == 0) {
      return mandatoryAvailableTimeRanges;
    } else {
      return mutualAvailableTimeRanges;
    }


    // ArrayList<TimeRange> sortedBusyTimeRanges = getSortedBusyTimeRanges(events, attendees);
    // // If attendees are not in existing events, return whole day as a valid time range.
    // if (sortedBusyTimeRanges == null) {
    //   return Arrays.asList(TimeRange.WHOLE_DAY);
    // }
    // // Merge any overlapping time ranges.
    // ArrayList<TimeRange> mergedBusyTimeRanges = getMergedBusyTimeRanges(sortedBusyTimeRanges);
    // // Get available time ranges
    // ArrayList<TimeRange> availableTimeRanges = getAvailableTimeRanges(mergedBusyTimeRanges, requestDuration);
    // // If there are no available slots for mandatory
    // return availableTimeRanges;
  }

  // Sorts ArrayList of TimeRanges by start time in ascending order.
  private ArrayList<TimeRange> sortTimeRanges(ArrayList<TimeRange> busySortedTimeRanges) {
    Collections.sort(busySortedTimeRanges, TimeRange.ORDER_BY_START);
    return busySortedTimeRanges;
  }

  // Returns an ArrayList of TimeRanges that required attendees are busy for. Sorted by start time in ascending order.
  private ArrayList<TimeRange> getSortedBusyTimeRanges(Collection<Event> events, Collection<String> attendees) {
    ArrayList<TimeRange> busyTimeRanges = new ArrayList<>();
    // Filter only for events that required attendees are in
    for (Event singleEvent : events) {
      // If a required attendee is contained in the list of attendees for the event, add its time range to the ArrayList filterEvents .
      for (String singleAttendee : attendees) {
        if (singleEvent.getAttendees().contains(singleAttendee)) {
          busyTimeRanges.add(singleEvent.getWhen());
          break;
        }
      }
    }
    // If the required attendees are not in any existing events, return null.
    if (busyTimeRanges.isEmpty()) {
      return null;
    }
    // Sort busy time ranges by start time in ascending order.
    ArrayList<TimeRange> sortedBusyTimeRanges = sortTimeRanges(busyTimeRanges);
    return sortedBusyTimeRanges; 
  }

  // Merges two time ranges
  private TimeRange merge(TimeRange firstTimeRange, TimeRange secondTimeRange) {
    // set start equal to start of firstTimeRange since the Time Ranges are ordered by start time.
    int start = firstTimeRange.start();
    int end = Math.max(firstTimeRange.end(), secondTimeRange.end());
    TimeRange mergedTimeRange = TimeRange.fromStartEnd(start, end, false);
    return mergedTimeRange;
  }

  // Returns ArrayList of TimeRanges with merged overlaps that attendees are busy for. 
  private ArrayList<TimeRange> getMergedBusyTimeRanges(ArrayList<TimeRange> sortedBusyTimeRanges) {
    ArrayList<TimeRange> mergedBusyTimeRanges = new ArrayList<>();
    // Set pointer to the first sorted busy time range.
    TimeRange lastMergedTimeRange = sortedBusyTimeRanges.get(0);
    // Initialize currentTimeRange to a valid Time Range outside of loop.
    TimeRange currentTimeRange = sortedBusyTimeRanges.get(0);
    for (int i = 1; i < sortedBusyTimeRanges.size(); i++) {
      currentTimeRange = sortedBusyTimeRanges.get(i);
      // Check if two compared time ranges overlap.
      if (lastMergedTimeRange.overlaps(currentTimeRange)) {
        // If overlaps, merge the two time ranges and set lastMergedTimeRange pointer to newly merged time range.
        TimeRange mergedTimeRange = merge(lastMergedTimeRange, currentTimeRange);
        lastMergedTimeRange = mergedTimeRange;
      } else {
        // If no overlaps, add lastMergedTimeRange to return ArrayList and set lastMergedTimeRange pointer to currentTimeRange.
        mergedBusyTimeRanges.add(lastMergedTimeRange);
        lastMergedTimeRange = currentTimeRange;
      }
    }
    // Account for the final potential merged time range.
    mergedBusyTimeRanges.add(lastMergedTimeRange);
    return mergedBusyTimeRanges;
  }

  private ArrayList<TimeRange> getAvailableTimeRanges(ArrayList<TimeRange> mergedBusyTimeRanges, int requestDuration) {
    ArrayList<TimeRange> availableTimeRanges = new ArrayList<>();
    int start = TimeRange.START_OF_DAY;
    int end = 0;
    int duration = 0;
    // Initialize currentMergedTimeRange to a valid Time Range outside of loop.
    TimeRange currentTimeRange = mergedBusyTimeRanges.get(0); 
    for (int i = 0; i < mergedBusyTimeRanges.size(); i++) {
      currentTimeRange = mergedBusyTimeRanges.get(i); 
      end = currentTimeRange.start();
      duration = end - start;
      if (duration >= requestDuration) {
        TimeRange availableTimeRange = TimeRange.fromStartEnd(start, end, false);
        availableTimeRanges.add(availableTimeRange);
      }
      // Assume that the end of a time range is NOT inclusive.
      start = currentTimeRange.end();
    }
    // Check if end of last time range to end of day is an available time range.
    end = TimeRange.END_OF_DAY;
    duration = end - start;
    if (duration >= requestDuration) {
      TimeRange availableTimeRange = TimeRange.fromStartEnd(start, end, true);
      availableTimeRanges.add(availableTimeRange);
    }
    return availableTimeRanges;
  }

  // Returns overlap of two time ranges.
  private TimeRange getOverlappingTimeRange(TimeRange mandatoryTimeRange, TimeRange optionalTimeRange) {
    // Set start equal to later start time. Set end equal to earlier end time.
    int start = Math.max(mandatoryTimeRange.start(), optionalTimeRange.start());
    int end = Math.min(mandatoryTimeRange.end(), optionalTimeRange.end());
    TimeRange overlappingTimeRange = TimeRange.fromStartEnd(start, end, false);
    return overlappingTimeRange;
  }

  // Returns available time ranges for one type of attendee
  private ArrayList<TimeRange> returnAvailableTimeRanges(Collection<Event> events, Collection<String> attendees, int requestDuration) {
    // Sort time ranges that attendees are busy for in ascending order by filtering through events
    ArrayList<TimeRange> sortedBusyTimeRanges = getSortedBusyTimeRanges(events, attendees);
    // If attendees are not in existing events, return whole day as a valid time range.
    if (sortedBusyTimeRanges == null) {
      ArrayList<TimeRange> availableTimeRanges = new ArrayList<>();
      availableTimeRanges.add(TimeRange.WHOLE_DAY);
      return availableTimeRanges;
    }
    // Merge any overlapping time ranges
    ArrayList<TimeRange> mergedBusyTimeRanges = getMergedBusyTimeRanges(sortedBusyTimeRanges);
    // Get available time ranges
    ArrayList<TimeRange> availableTimeRanges = getAvailableTimeRanges(mergedBusyTimeRanges, requestDuration);
    return availableTimeRanges;
  }

  // Returns overlapping time ranges between mandatory & optional time ranges that have a valid duration.
  private ArrayList<TimeRange> getMutualAvailableTimeRanges(ArrayList<TimeRange> mandatoryAvailableTimeRanges, ArrayList<TimeRange> optionalAvailableTimeRanges, int requestDuration) {
    // Check edge case if there are no available time ranges for mandatory or optional attendees
    ArrayList<TimeRange> mutualAvailableTimeRanges = new ArrayList<>();
    if ((mandatoryAvailableTimeRanges.size() == 0) || (optionalAvailableTimeRanges.size() == 0)) {
      return mutualAvailableTimeRanges;
    }
    int i = 0;
    int j = 0;
    // Initialize time ranges to valid time ranges.
    TimeRange mandatoryTimeRange = mandatoryAvailableTimeRanges.get(0);
    TimeRange optionalTimeRange = optionalAvailableTimeRanges.get(0);
    while ((i < mandatoryAvailableTimeRanges.size()) && (j < optionalAvailableTimeRanges.size())) {
      mandatoryTimeRange = mandatoryAvailableTimeRanges.get(i);
      optionalTimeRange = optionalAvailableTimeRanges.get(j);
      if (mandatoryTimeRange.overlaps(optionalTimeRange)) {
        TimeRange overlappingTimeRange = getOverlappingTimeRange(mandatoryTimeRange, optionalTimeRange);
        // Check if the overlapping time range has a valid duration and add to mutual available time ranges.
        if (overlappingTimeRange.duration() >= requestDuration) {
          mutualAvailableTimeRanges.add(overlappingTimeRange);
        }
      }
      // Move pointer of the time range with an earlier end to its next time range.
      if (mandatoryTimeRange.end() < optionalTimeRange.end()) {
        i++;
      } else if (mandatoryTimeRange.end() > optionalTimeRange.end()) {
        j++;
      } else { // If both time ranges have the same end, move both pointers.
        i++;
        j++;
      }
    }
    return mutualAvailableTimeRanges;
  }
}
