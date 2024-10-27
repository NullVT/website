<template>
  <div class="flex h-full flex-col rounded-lg text-white my-4">
    <header
      class="relative flex flex-none items-center justify-center w-full py-4"
    >
      <!-- title -->
      <h1
        class="absolute inset-x-0 text-center font-bold text-3xl text-primary"
      >
        Schedule
      </h1>

      <div class="flex items-center justify-end ml-auto space-x-2 mr-4 z-10">
        <!-- Decrement hour -->
        <button
          type="button"
          class="flex items-center justify-center text-gray-400 hover:text-primary"
          :disabled="startHour === 0"
          @click="decrementTime"
        >
          <ChevronLeftIcon class="h-7 w-7" aria-hidden="true" />
        </button>

        <!-- Increment hour -->
        <button
          type="button"
          class="flex items-center justify-center text-gray-400 hover:text-primary"
          :disabled="endHour >= 24"
          @click="incrementTime"
        >
          <ChevronRightIcon class="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
    </header>

    <!-- Calendar Grid -->
    <div class="flex-auto overflow-x-hidden bg-background rounded-lg">
      <div
        class="grid grid-cols-32 text-center text-sm text-white font-bold pt-4"
      >
        <!-- First 4 columns reserved for timezone label -->
        <div class="col-span-4 py-2 text-gray-500">
          <span :title="timezone.long">
            {{ timezone.short }}
          </span>
        </div>

        <!-- Time slots at the top (spanning remaining columns) -->
        <div
          v-for="(time, index) in timeSlots"
          :key="index"
          class="col-span-4 py-2 border-b border-base"
          :class="isCurrentHour(time) && 'border-b-2 border-primary'"
        >
          {{ time }}
        </div>
      </div>

      <!-- Calendar content (Events per day) -->
      <div class="grid grid-rows-7">
        <div
          v-for="day in days"
          :key="day.date"
          class="grid grid-cols-32 h-20"
          :class="day.isCurrent && 'bg-primary/10'"
        >
          <!-- Day label (spans 4 columns) -->
          <div
            class="col-span-4 flex items-center justify-center text-white font-semibold border-r border-base h-full"
            :class="day.isCurrent && 'border-r-2 border-primary'"
          >
            {{ day.name }}
          </div>

          <!-- Loop through events for this day (spanning remaining columns) -->
          <div
            v-for="event in eventsForDay(day)"
            :key="event.title"
            class="bg-gray-600 text-white p-2 rounded-lg relative overflow-hidden my-1"
            :class="getEventClass(event)"
          >
            <div class="font-bold">{{ event.title }}</div>
            <div class="text-sm text-gray-400">
              {{ formatEventTime(event) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/16/solid";
import { DateTime } from "luxon";
import { ref, onMounted } from "vue";

// timezone variable
const getTimeZone = () => {
  const now = DateTime.local();
  return {
    long: now.offsetNameLong,
    short: now.offsetNameShort,
  };
};
const timezone = ref(getTimeZone());

// get the current week's days based on the timezone and locale
const getCurrentWeekDays = () => {
  const now = DateTime.local();
  const startOfWeek = now.startOf("week", { useLocaleWeeks: true });

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = startOfWeek.plus({ days: i });
    weekDays.push({
      date: day,
      name: day.toLocaleString({
        day: "numeric",
        month: "numeric",
        weekday: "short",
      }),
      isCurrent: day.toISODate() === now.toISODate(),
    });
  }
  return weekDays;
};
const days = ref(getCurrentWeekDays());

// Time range for the calendar
const startHour = ref(0);
const endHour = ref(24);
const timeSlots = ref([]);

// Dummy events array for the week (using the timezone)
const events = ref([
  {
    title: "Chrono Trigger first playthrough",
    start: DateTime.fromISO("2024-10-21T13:10:00Z"),
    end: DateTime.fromISO("2024-10-21T22:05:00Z"),
  },
  {
    title: "Bioshock Infinite",
    start: DateTime.fromISO("2024-10-23T19:20:00Z"),
    end: DateTime.fromISO("2024-10-23T23:00:00Z"),
  },
  {
    title: "Chill coding",
    start: DateTime.fromISO("2024-10-26T20:00:00Z"),
    end: DateTime.fromISO("2024-10-26T23:00:00Z"),
  },
  {
    title: "Gaming/Coding",
    start: DateTime.fromISO("2024-10-27T18:00:00Z"),
    end: DateTime.fromISO("2024-10-27T23:00:00Z"),
  },
]);

// initialize start and end hours so that the current hour is centered
const initializeTimeRange = () => {
  const currentHour = DateTime.local().hour;

  // Set the start and end hours such that the current hour is centered
  const range = 7;
  startHour.value = Math.max(0, currentHour - Math.floor(range / 2)); // Prevent going below 0
  endHour.value = Math.min(24, startHour.value + range); // Prevent going above 24

  // Adjust start hour in case the end hour exceeds 24
  if (endHour.value > 24) {
    startHour.value = 24 - range;
    endHour.value = 24;
  }

  // Update the time slots after setting the range
  updateTimeSlots();
};
onMounted(initializeTimeRange);

const updateTimeSlots = () => {
  timeSlots.value = [];
  for (let hour = startHour.value; hour < endHour.value; hour++) {
    timeSlots.value.push(`${hour}:00`);
  }
};

const isCurrentHour = (hour) => {
  const now = DateTime.local();
  return hour === `${now.hour}:00`;
};

const formatEventTime = (event) => {
  const start = event.start.toFormat("HH:mm");
  const end = event.end.toFormat("HH:mm");
  return `${start} - ${end}`;
};

const incrementTime = () => {
  if (endHour.value < 24) {
    startHour.value += 1;
    endHour.value += 1;
    updateTimeSlots();
  }
};

const decrementTime = () => {
  if (startHour.value > 0) {
    startHour.value -= 1;
    endHour.value -= 1;
    updateTimeSlots();
  }
};

const eventsForDay = (day) => {
  return events.value.filter((event) => {
    // Ensure the event is on the correct day
    if (!event.start.hasSame(day.date, "day")) {
      return false;
    }

    // Convert the event's start and end times to the current timezone
    const eventStart = event.start;
    const eventEnd = event.end;

    // Filter out events that start after the visible end hour or end before the visible start hour
    const eventStartHour = eventStart.hour;
    const eventEndHour = eventEnd.hour;

    return !(
      eventStartHour >= endHour.value || eventEndHour <= startHour.value
    );
  });
};

// round time to the nearest 15 minutes using Luxon
const roundToNearest15 = (dateTime) => {
  const minutes = dateTime.minute;
  const roundedMinutes = Math.round(minutes / 15) * 15;
  return dateTime.set({ minute: roundedMinutes, second: 0 });
};

// calculate the correct grid column based on the event's start and end time
const getEventClass = (event) => {
  const roundedStart = roundToNearest15(event.start);
  const roundedEnd = roundToNearest15(event.end);

  const eventStartHour = roundedStart.hour;
  const startMinute = roundedStart.minute;
  const endHour = roundedEnd.hour;
  const endMinute = roundedEnd.minute;

  // Calculate start and end columns based on time slots
  let startColumn =
    (eventStartHour - startHour.value) * 4 + Math.floor(startMinute / 15) + 5;
  let endColumn =
    (endHour - startHour.value) * 4 + Math.floor(endMinute / 15) + 5;

  // Adjust startColumn if the event starts before the visible range
  if (eventStartHour < startHour.value) {
    startColumn = 5;
  }

  // Adjust endColumn if the event ends after the visible range
  if (
    endHour >= endHour.value ||
    (endHour === endHour.value && endMinute > 0)
  ) {
    endColumn = 33; // Line after the last visible column (32 + 1)
  }

  // Ensure columns stay within valid range
  startColumn = Math.max(5, startColumn);
  endColumn = Math.min(33, endColumn);

  // Add classes to remove rounded corners on the leftmost or rightmost column
  let classList = [`col-start-${startColumn}`, `col-end-${endColumn}`];
  if (startColumn === 5) {
    classList.push("rounded-l-none");
  }
  if (endColumn === 33) {
    classList.push("rounded-r-none");
  }

  return classList;
};
</script>

<style scoped>
.grid {
  overflow: hidden;
}
.rounded-l-none {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.rounded-r-none {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
