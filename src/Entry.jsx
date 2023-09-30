/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categoryOptions = {
  FoodDrinks: "45288150",
  Transport: "45288154",
  Grocery: "66315236",
  Other: "49909576",
  ClothingFootwear: "45288151",
  Goods: "49627078",
  HealthPersonalCare: "45288153",
  Fun: "49627216",
  Sports: "45288156",
  Salary: "45288163",
  Bill: "65656652",
  unsorted: "unsorted",
};

const tagsOptions = {
  Dating: "19800891",
  Delivery: "72377168",
  Lunch: "18323682",
  Dinner: "18323684",
  Drinks: "18747482",
  Dessert: "19170811",
  Snacks: "18756337",
  BreakFast: "18323679",
  Parking: "18747614",
  Me: "20034015",
  Movie: "18758782",
  Fruit: "22290902",
  TouchnGo: "20124621",
  Petrol: "19317448",
  Work: "18650735",
  KTM: "18635533",
};

const Entry = ({ data, i, onChange, onRemove }) => {
  const removeEntry = () => {
    onRemove(i);
  };

  const [entryData, setEntryData] = useState({
    date: undefined,
    category: undefined,
    tags: [],
    amount: undefined,
    desc: undefined,
  });

  useEffect(() => {
    onChange(i, entryData);
  }, [i, onChange, entryData]);

  const toggleTag = (event) => {
    const { value, state } = event.target.dataset;

    setEntryData((prev) => ({
      ...prev,
      tags:
        state == "off"
          ? [...prev.tags, value]
          : prev.tags.filter((tag) => tag !== value),
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="self-start gap-2 border border-dotted">
        <Button
          variant={"ghost"}
          onClick={() => {
            setEntryData((prev) => ({
              ...prev,
              category: categoryOptions.FoodDrinks,
              tags: [
                tagsOptions.Dating,
                tagsOptions.Delivery,
                tagsOptions.Lunch,
              ],
            }));
          }}
        >
          Delivery Lunch
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setEntryData((prev) => ({
              ...prev,
              category: categoryOptions.FoodDrinks,
              tags: [
                tagsOptions.Dating,
                tagsOptions.Delivery,
                tagsOptions.Dinner,
              ],
            }));
          }}
        >
          Delivery Dinner
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setEntryData((prev) => ({
              ...prev,
              category: categoryOptions.FoodDrinks,
              tags: [tagsOptions.Dating, tagsOptions.Lunch],
            }));
          }}
        >
          Lunch
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setEntryData((prev) => ({
              ...prev,
              category: categoryOptions.FoodDrinks,
              tags: [tagsOptions.Dating, tagsOptions.Dinner],
            }));
          }}
        >
          Dinner
        </Button>
      </div>

      <div className="flex items-start gap-2">
        <div className={colCss}>
          <Label htmlFor="fc">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !data.date && "text-muted-foreground",
                )}
              >
                {data.date ? (
                  format(data.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
              <Select
                onValueChange={(value) =>
                  setEntryData((prev) => ({
                    ...prev,
                    date: addDays(new Date(), parseInt(value)),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="-1">Yesterday</SelectItem>
                  <SelectItem value="-2">YesYesterday</SelectItem>
                  <SelectItem value="-3">YesYesYesterday</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar
                  mode="single"
                  selected={data.date}
                  onSelect={(value) =>
                    setEntryData((prev) => ({ ...prev, date: value }))
                  }
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className={colCss}>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            onValueChange={(value) =>
              setEntryData((prev) => ({ ...prev, category: value }))
            }
            value={data.category}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryOptions).map(([label, value]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={colCss}>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="text"
            onChange={(event) =>
              setEntryData((prev) => ({ ...prev, amount: event.target.value }))
            }
            value={data.amount}
          />
        </div>

        <div className={`${colCss} flex-1`}>
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            onChange={(event) =>
              setEntryData((prev) => ({ ...prev, desc: event.target.value }))
            }
            value={data.desc}
          />
        </div>

        <div className={`${colCss} justify-end`}>
          <Button variant={"link"} onClick={removeEntry}>
            X
          </Button>
        </div>
      </div>

      <div className={`flex items-center`}>
        <div className="flex flex-wrap gap-1">
          {Object.entries(tagsOptions).map(([label, value]) => (
            <Toggle
              key={value}
              data-value={value}
              data-state={data.tags.includes(value) ? "on" : "off"}
              onClick={toggleTag}
            >
              {label}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Entry;

const colCss = "grid grid-row-2 gap-2 text-left items-start";
