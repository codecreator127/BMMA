"use client"
import Link from 'next/link';
import React, { useState, ChangeEvent } from 'react';
import { useSettings } from '../context/settingsContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const [newCourts, setNewCourts] = useState<string>('');
  const [newRounds, setNewRounds] = useState<string>('');
  const { courts, setCourts, setRounds } = useSettings();

  const handleSaveChanges = (): void => {
    if (newCourts || newRounds) {
      if (newCourts) {
        setCourts(parseInt(newCourts));
      }
      if (newRounds) {
        setRounds(parseInt(newRounds));
      }
      alert("Changes saved successfully");
    } else {
      alert("Please change a value before saving");
    }
  };

  const handleNumberChange = (
    e: ChangeEvent<HTMLInputElement>, 
    setter: (value: string) => void,
    maxValue: number
  ): void => {
    const value = e.target.value;
    if (parseInt(value) >= 1 && parseInt(value) <= maxValue) {
      setter(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Settings</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="courts" className="text-sm font-medium">
              Number of Courts
            </Label>
            <Input
              id="courts"
              type="number"
              min={1}
              max={12}
              value={newCourts}
              onChange={(e) => handleNumberChange(e, setNewCourts, 12)}
              placeholder="Enter number (1-12)"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rounds" className="text-sm font-medium">
              Number of Rounds
            </Label>
            <Input
              id="rounds"
              type="number"
              min={1}
              max={20}
              value={newRounds}
              onChange={(e) => handleNumberChange(e, setNewRounds, 20)}
              placeholder="Enter number (1-20)"
              className="w-full"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button 
            onClick={handleSaveChanges}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
          
          <Link href="/home" className="w-full sm:w-auto">
            <Button 
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}