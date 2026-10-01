"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { DIAL_CODES, getDialCode, countryCodeToFlag } from "@/lib/dialCodes";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

// Sorted longest-first so "+1868" matches before "+1"
const SORTED_ENTRIES = Object.entries(DIAL_CODES).sort((a, b) => b[1].length - a[1].length);

function parseValue(value) {
  if (!value) return { code: null, num: "" };
  const v = value.trim();
  for (const [code, dc] of SORTED_ENTRIES) {
    if (v.startsWith(dc)) return { code, num: v.slice(dc.length).trimStart() };
  }
  return { code: null, num: v };
}

const PHONE_COUNTRIES = COUNTRIES
  .map(({ code, name }) => ({ code, name, dialCode: DIAL_CODES[code], flag: countryCodeToFlag(code) }))
  .filter((c) => c.dialCode);

// PhoneInput — compound input with flag + dial-code picker and number field.
// value:         full E.164-ish string e.g. "+260 97 123 456"
// onChange:      called as onChange({ target: { name, value: fullNumber } })
// countryCode:   optional ISO code from a parent country selector — auto-syncs the dial code
// defaultCountry: fallback when no value/countryCode provided (default "ZM")
export function PhoneInput({
  id,
  name,
  value = "",
  onChange,
  countryCode,
  defaultCountry = "ZM",
  placeholder = "000 000 000",
  required,
  disabled,
  className,
}) {
  const initialParsed = useMemo(() => {
    const parsed = parseValue(value);
    return { code: parsed.code ?? countryCode ?? defaultCountry, num: parsed.num };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCode, setSelectedCode] = useState(initialParsed.code);
  const [numPart, setNumPart] = useState(initialParsed.num);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const dialCode = getDialCode(selectedCode);
  const selected = PHONE_COUNTRIES.find((c) => c.code === selectedCode);

  // Sync external countryCode → update selected code + bubble combined value
  useEffect(() => {
    if (countryCode && DIAL_CODES[countryCode] && countryCode !== selectedCode) {
      setSelectedCode(countryCode);
      const dc = getDialCode(countryCode);
      onChange?.({ target: { name, value: numPart ? `${dc}${numPart}` : "" } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  // Close dropdown on outside click
  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  function selectCountry(code) {
    setSelectedCode(code);
    const dc = getDialCode(code);
    onChange?.({ target: { name, value: numPart ? `${dc}${numPart}` : "" } });
    setOpen(false);
    setSearch("");
  }

  function handleNumChange(e) {
    const num = e.target.value;
    setNumPart(num);
    onChange?.({ target: { name, value: num ? `${dialCode}${num}` : "" } });
  }

  const filtered = useMemo(() => {
    if (!search) return PHONE_COUNTRIES;
    const q = search.toLowerCase();
    return PHONE_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q),
    );
  }, [search]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {/* Country code button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex shrink-0 items-center gap-1 rounded-l-md border-r border-input bg-muted/40 px-3 py-2 text-sm transition-colors hover:bg-muted disabled:opacity-50"
      >
        <span className="select-none text-base leading-none">{selected?.flag ?? "🌐"}</span>
        <span className="min-w-[2.75rem] text-xs font-medium text-brand-navy-dark">
          {dialCode || "+???"}
        </span>
        <ChevronDown
          className={cn("size-3 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {/* Number input */}
      <input
        id={id}
        name={name}
        type="tel"
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={numPart}
        onChange={handleNumChange}
        autoComplete="tel-national"
        className="min-w-0 flex-1 rounded-r-md bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-md border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-blue/40"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-4 py-2 text-sm text-muted-foreground">No results</li>
            ) : (
              filtered.map((c) => (
                <li
                  key={c.code}
                  role="option"
                  aria-selected={c.code === selectedCode}
                  onClick={() => selectCountry(c.code)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-accent",
                    c.code === selectedCode && "bg-accent",
                  )}
                >
                  <span className="select-none text-base">{c.flag}</span>
                  <span className="flex-1 truncate text-brand-navy-dark">{c.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{c.dialCode}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
