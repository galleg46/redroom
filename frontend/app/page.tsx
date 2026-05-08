"use client";

import { CustomButton } from "@/app/components/ui/CustomButton";

export default function HomePage() {

  return (
      <main className="flex min-h-screen flex-col p-6">
          <div className="flex flex-col items-center justify-center">
              <p>First Time attending an event at Red Room? Please fill out the waiver below.</p>
              <div className="mt-4">
                  <CustomButton variant="contained" href="/waiver">Waiver</CustomButton>
              </div>
          </div>
      </main>
  );
}