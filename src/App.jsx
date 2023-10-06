import { Fragment, useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import "./App.css";
import Entry from "./Entry";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { categoryOptions, tagsOptions } from "./utils/data";

const App = () => {
  const [entries, setEntries] = useState([]);
  const [output, setOutput] = useState();

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  }, []);

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

  const onSubmit = useCallback((data) => {
    setEntries((prevEntries) => [...prevEntries, data]);
  }, []);

  const onRemove = (i) => {
    setEntries((prev) => prev.filter((_, index) => index !== i));
  };

  return (
    <div className="p-6 m-auto min-h-[100dvh] w-full max-w-7xl flex flex-col gap-2">
      <div className="flex justify-end">
        <Button className="h-12" onClick={onGenerate}>
          Generate
        </Button>
      </div>
      <Entry onSubmit={onSubmit} />
      <div className="my-2" />
      <Separator />

      {entries.map((x, index) => {
        let c = "";
        let t = [];

        for (const property in tagsOptions) {
          if (x.tags.includes(tagsOptions[property])) {
            t.push(property);
          }
        }
        for (const property in categoryOptions) {
          if (categoryOptions[property] === x.category) {
            c = property;
            break;
          }
        }

        return (
          <Fragment key={index}>
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div>{format(x.date, "yyyy-MM-dd")}</div>
                <div>{c}</div>
                <div>{t.join(", ")}</div>
                <div>{x.amount}</div>
                <div>{x.desc}</div>
              </div>
              <Button
                className="py-0 h-auto"
                variant={"link"}
                onClick={() => onRemove(index)}
              >
                X
              </Button>
            </div>
            <Separator />
          </Fragment>
        );
      })}

      {output && <p className="text-left mt-6">{output} location.reload();</p>}
    </div>
  );
};

export default App;
