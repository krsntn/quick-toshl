import { Fragment, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import "./App.css";
import Entry from "./Entry";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const data = {
  date: null,
  category: null,
  tags: [],
  amount: null,
  desc: null,
};

const App = () => {
  const [entries, setEntries] = useState(() => [structuredClone(data)]);
  const [output, setOutput] = useState();

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  }, []);

  const addEntry = () => {
    setEntries((prev) => [...prev, structuredClone(data)]);
  };

  const onGenerate = async () => {
    const outs = entries
      .map((x) => {
        const { amount, category, desc, date, tags } = x;
        return `
        await fetch("https://toshl.com/api/entries?immediate_update=true", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            account: ${import.meta.env.VITE_ACCOUNT},
            amount: ${amount * -1},
            category: "${category}",
            desc: "${desc}",
            currency: {
              code: "MYR",
              fixed: false,
              main_rate: null,
              rate: null,
              ref: "MYR",
            },
            date: "${format(date, "yyyy-MM-dd")}",
            reminders: [],
            tags: [${tags}],
          }),
        }).then((response) => {
          console.log(response);
        });
      `;
      })
      .join("");

    setOutput(outs);

    try {
      await navigator.clipboard.writeText(`${outs} location.reload();`);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const onChange = useCallback((index, data) => {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[index] = { ...newEntries[index], ...data };
      return newEntries;
    });
  }, []);

  const onRemove = (i) => {
    setEntries((prev) => prev.filter((_, index) => index !== i));
  };

  return (
    <div className="p-6 m-auto min-h-[100dvh] w-full max-w-7xl flex flex-col gap-2">
      {entries.map((x, index) => (
        <Fragment key={index}>
          <Entry data={x} i={index} onChange={onChange} onRemove={onRemove} />
          <Separator />
        </Fragment>
      ))}
      <div className="my-2" />
      <Button className="h-12" onClick={addEntry}>
        Add New Entry
      </Button>
      <Button className="h-12" onClick={onGenerate}>
        Generate
      </Button>

      {output && <p className="text-left mt-6">{output} location.reload();</p>}
    </div>
  );
};

export default App;
