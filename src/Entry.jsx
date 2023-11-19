/* eslint-disable react/prop-types */

import { useState, useEffect, useCallback } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { categoryOptions, tagsOptions } from "./utils/data";

const initEntryData = {
  date: undefined,
  category: undefined,
  tags: [],
  amount: undefined,
  desc: undefined,
};

const Entry = ({ onSubmit }) => {
  const [entryData, setEntryData] = useState(() => initEntryData);
  const [searchInput, setSearchInput] = useState("");

  const submit = useCallback(() => {
    const { date, category, tags, amount, desc } = entryData;
    if (date && category && tags.length > 0 && amount && desc) {
      onSubmit(entryData);
    }
  }, [entryData, onSubmit]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        submit();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [submit]);

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
                  !entryData.date && "text-muted-foreground",
                )}
              >
                {entryData.date ? (
                  format(entryData.date, "PPP")
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
                  selected={entryData.date}
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
            value={entryData.category}
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
            value={entryData.amount || ""}
          />
        </div>

        <div className={`${colCss} flex-1`}>
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            onChange={(event) =>
              setEntryData((prev) => ({ ...prev, desc: event.target.value }))
            }
            value={entryData.desc || ""}
          />
        </div>
      </div>

      <div className={`flex items-start gap-2`}>
        <div className="flex flex-wrap gap-1">
          <Command>
            <CommandInput
              value={searchInput}
              onInput={(e) => setSearchInput(e.target.value)}
              placeholder="Search tags..."
            />
            <CommandList className="h-28">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(tagsOptions).map(([label, value]) => (
                  <CommandItem
                    key={value}
                    value={label}
                    onSelect={(currentValue) => {
                      const tagValue = Object.entries(tagsOptions).find(
                        ([label]) => label.toLowerCase() === currentValue,
                      )[1];
                      setEntryData((prev) => ({
                        ...prev,
                        tags: !prev.tags.find((tag) => tag === tagValue)
                          ? [...prev.tags, tagValue]
                          : prev.tags.filter((tag) => tag !== tagValue),
                      }));
                      setSearchInput("");
                    }}
                  >
                    {label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <div className="flex flex-wrap gap-1">
          {Object.entries(tagsOptions).map(([label, value]) => (
            <Toggle
              key={value}
              data-value={value}
              data-state={entryData.tags.includes(value) ? "on" : "off"}
              onClick={toggleTag}
            >
              {label}
            </Toggle>
          ))}
        </div>
      </div>

      <Button className="h-12" onClick={submit}>
        Add
      </Button>
    </div>
  );
};

export default Entry;

const colCss = "grid grid-row-2 gap-2 text-left items-start";
