<template>
  <div class="flex h-full flex-col rounded-lg text-white my-4">
    <header
      class="relative flex flex-none items-center justify-center w-full py-4"
    >
      <!-- Centered Title -->
      <h1
        class="absolute inset-x-0 text-center font-bold text-3xl text-primary"
      >
        Schedule
      </h1>

      <!-- Buttons on the right -->
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
        <div class="col-span-4 py-2 text-gray-500">{{ timezone }}</div>
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
        <div v-for="day in days" :key="day.date" class="grid grid-cols-32 h-20">
          <!-- Day label (spans 4 columns) -->
          <div
            class="col-span-4 flex items-center justify-center text-white font-semibold border-r border-base h-full"
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

// Timezone variable
const timezone = ref("EST");

// Time range for the calendar
const startHour = ref(0);
const endHour = ref(24);
const timeSlots = ref([]);

// Function to get the current week's days based on the timezone and locale (starting from Sunday)
function getCurrentWeekDays() {
  const now = DateTime.local().setZone(timezone.value);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = now.plus({ days: i }).setLocale(now.locale); // Adjust locale and timezone
    weekDays.push({
      date: day,
      name: day.toFormat("ccc dd/MM"), // Localized day name (e.g., Sun 20/10)
    });
  }
  return weekDays;
}

// Set days for the current week
const days = ref(getCurrentWeekDays());

// Dummy events array for the week (using the timezone)
const events = ref([
  {
    title: "Chrono Trigger first playthrough",
    start: DateTime.fromISO("2024-10-21T13:10:00Z").setZone(timezone.value),
    end: DateTime.fromISO("2024-10-21T22:05:00Z").setZone(timezone.value),
  },
  {
    title: "Bioshock Infinite",
    start: DateTime.fromISO("2024-10-23T19:20:00Z").setZone(timezone.value),
    end: DateTime.fromISO("2024-10-23T23:00:00Z").setZone(timezone.value),
  },
  {
    title: "Chill coding",
    start: DateTime.fromISO("2024-10-26T20:00:00Z").setZone(timezone.value),
    end: DateTime.fromISO("2024-10-26T23:00:00Z").setZone(timezone.value),
  },
  {
    title: "Gaming/Coding",
    start: DateTime.fromISO("2024-10-27T18:00:00Z").setZone(timezone.value),
    end: DateTime.fromISO("2024-10-27T23:00:00Z").setZone(timezone.value),
  },
]);

// Function to initialize start and end hours so that the current hour is centered
function initializeTimeRange() {
  const now = DateTime.local().setZone(timezone.value); // Get current time in the set timezone
  const currentHour = now.hour; // Get the current hour

  // Set the start and end hours such that the current hour is centered
  const range = 7; // Display range of 7 hours (adjust this value if you want a different range)
  startHour.value = Math.max(0, currentHour - Math.floor(range / 2)); // Prevent going below 0
  endHour.value = Math.min(24, startHour.value + range); // Prevent going above 24

  // Adjust start hour in case the end hour exceeds 24
  if (endHour.value > 24) {
    startHour.value = 24 - range;
    endHour.value = 24;
  }

  // Update the time slots after setting the range
  updateTimeSlots();
}
onMounted(initializeTimeRange);

// Format the time range based on startHour and endHour
function updateTimeSlots() {
  timeSlots.value = [];
  for (let hour = startHour.value; hour < endHour.value; hour++) {
    timeSlots.value.push(`${hour}:00`);
  }
}

function isCurrentHour(hour) {
  const now = DateTime.local().setZone(timezone.value);
  return hour === `${now.hour}:00`;
}

// Increment and decrement time range with button disabling conditions
function incrementTime() {
  if (endHour.value < 24) {
    startHour.value += 1;
    endHour.value += 1;
    updateTimeSlots();
  }
}

function decrementTime() {
  if (startHour.value > 0) {
    startHour.value -= 1;
    endHour.value -= 1;
    updateTimeSlots();
  }
}

// Function to filter events for a given day
function eventsForDay(day) {
  return events.value.filter((event) => {
    // Ensure the event is on the correct day
    if (!event.start.hasSame(day.date, "day")) {
      return false;
    }

    // Convert the event's start and end times to the current timezone
    const eventStart = event.start.setZone(timezone.value);
    const eventEnd = event.end.setZone(timezone.value);

    // Filter out events that start after the visible end hour or end before the visible start hour
    const eventStartHour = eventStart.hour;
    const eventEndHour = eventEnd.hour;

    return !(
      eventStartHour >= endHour.value || eventEndHour <= startHour.value
    );
  });
}

// Helper function to round time to the nearest 15 minutes using Luxon
function roundToNearest15(dateTime) {
  const minutes = dateTime.minute;
  const roundedMinutes = Math.round(minutes / 15) * 15;
  return dateTime.set({ minute: roundedMinutes, second: 0 });
}

// Helper function to calculate the correct grid column based on the event's start and end time
function getEventClass(event) {
  const roundedStart = roundToNearest15(event.start).setZone(timezone.value);
  const roundedEnd = roundToNearest15(event.end).setZone(timezone.value);

  const eventStartHour = roundedStart.hour;
  const startMinute = roundedStart.minute;
  const endHour = roundedEnd.hour;
  const endMinute = roundedEnd.minute;

  // Calculate start and end columns based on time slots (assuming 4 columns per hour)
  let startColumn =
    (eventStartHour - startHour.value) * 4 + Math.floor(startMinute / 15) + 5;
  let endColumn =
    (endHour - startHour.value) * 4 + Math.floor(endMinute / 15) + 5;

  // Adjust startColumn if the event starts before the visible range
  if (eventStartHour < startHour.value) {
    startColumn = 5; // First visible column
  }

  // Adjust endColumn if the event ends after the visible range
  if (
    endHour >= endHour.value ||
    (endHour === endHour.value && endMinute > 0)
  ) {
    endColumn = 33; // Line after the last visible column (32 + 1)
  }

  // Ensure columns stay within valid range
  startColumn = Math.max(5, startColumn); // Min column boundary
  endColumn = Math.min(33, endColumn); // Max column boundary

  // Add classes to remove rounded corners on the leftmost or rightmost column
  let classList = [`col-start-${startColumn}`, `col-end-${endColumn}`];
  if (startColumn === 5) {
    classList.push("rounded-none-l"); // Remove left rounding if it's in the first visible column
  }
  if (endColumn === 33) {
    classList.push("rounded-none-r"); // Remove right rounding if it's in the last visible column
  }

  return classList;
}

// Helper function to format event time display using Luxon and the specified timezone
function formatEventTime(event) {
  const start = event.start.setZone(timezone.value).toFormat("HH:mm");
  const end = event.end.setZone(timezone.value).toFormat("HH:mm");
  return `${start} - ${end}`;
}
</script>

<style scoped>
.grid {
  overflow: hidden;
}
.rounded-none-l {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.rounded-none-r {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>
