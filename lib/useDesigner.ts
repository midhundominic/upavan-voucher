"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { createWorkspace } from "@/lib/templates";
import { loadDesign, saveDesign } from "@/lib/design-storage";
import type {
  DesignElement,
  DesignSide,
  DesignWorkspace,
  ElementSelection,
  TemplateId,
} from "@/types/design";

type History = { present: DesignWorkspace; past: DesignWorkspace[]; future: DesignWorkspace[] };
type Action =
  | { type: "hydrate" | "replace" | "preview"; value: DesignWorkspace }
  | { type: "undo" | "redo" }
  | { type: "commit"; previous: DesignWorkspace };
function reducer(state: History, action: Action): History {
  switch (action.type) {
    case "hydrate":
      return { present: action.value, past: [], future: [] };
    case "preview":
      return { ...state, present: action.value };
    case "replace":
      return { present: action.value, past: [...state.past.slice(-39), state.present], future: [] };
    case "commit":
      return JSON.stringify(action.previous) === JSON.stringify(state.present)
        ? state
        : { ...state, past: [...state.past.slice(-39), action.previous], future: [] };
    case "undo":
      return state.past.length
        ? {
            present: state.past.at(-1)!,
            past: state.past.slice(0, -1),
            future: [state.present, ...state.future],
          }
        : state;
    case "redo":
      return state.future.length
        ? {
            present: state.future[0],
            past: [...state.past, state.present],
            future: state.future.slice(1),
          }
        : state;
  }
}

export function useDesigner() {
  const [history, dispatch] = useReducer(reducer, undefined, () => ({
    present: createWorkspace(),
    past: [],
    future: [],
  }));
  const [selected, setSelected] = useState<ElementSelection | null>(null);
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  const gesture = useRef<DesignWorkspace | null>(null);
  const { present } = history;
  const design = present.drafts[present.template];
  const selectedElement = selected
    ? (design[selected.side].find(({ id }) => id === selected.id) ?? null)
    : null;
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "hydrate", value: loadDesign() });
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setSaved(saveDesign(present)), 100);
    const flush = () => saveDesign(present);
    window.addEventListener("pagehide", flush);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", flush);
      saveDesign(present);
    };
  }, [present, ready]);
  function update(side: DesignSide, id: string, patch: Partial<DesignElement>, preview = false) {
    const list = design[side].map((item) =>
      item.id === id ? { ...item, ...patch, id: item.id, kind: item.kind } : item,
    );
    dispatch({
      type: preview ? "preview" : "replace",
      value: {
        ...present,
        drafts: { ...present.drafts, [present.template]: { ...design, [side]: list } },
      },
    });
  }
  function changeList(side: DesignSide, list: DesignElement[]) {
    dispatch({
      type: "replace",
      value: {
        ...present,
        drafts: { ...present.drafts, [present.template]: { ...design, [side]: list } },
      },
    });
  }
  function remove() {
    if (!selected || !selectedElement || selectedElement.locked) return;
    changeList(
      selected.side,
      design[selected.side].filter(({ id }) => id !== selected.id),
    );
    setSelected(null);
  }
  function add(side: DesignSide, kind: "text" | "shape" | "image") {
    if (design[side].length >= 100) return;
    const id = `custom-${crypto.randomUUID()}`;
    changeList(side, [
      ...design[side],
      {
        id,
        label: kind === "text" ? "Your text" : kind === "image" ? "Your photograph" : "Your shape",
        kind,
        x: 300,
        y: 240,
        width: 300,
        height: kind === "text" ? 80 : 160,
        rotation: 0,
        opacity: 1,
        hidden: false,
        locked: false,
        text: "Your personal message",
        fontSize: 30,
        fontFamily: "serif",
        fontWeight: 500,
        align: "center",
        lineHeight: 1.15,
        color: kind === "shape" ? "#d7bd78" : present.template === "forest" ? "#fffdf8" : "#063d2b",
        asset: "mainRoomImage",
        radius: 6,
      },
    ]);
    setSelected({ side, id });
    setEditing(true);
  }
  function reorder(direction: "up" | "down") {
    if (!selected || !selectedElement || selectedElement.locked) return;
    const items = [...design[selected.side]];
    const from = items.findIndex(({ id }) => id === selected.id);
    const to = Math.max(0, Math.min(items.length - 1, from + (direction === "up" ? 1 : -1)));
    [items[from], items[to]] = [items[to], items[from]];
    changeList(selected.side, items);
  }
  function duplicate() {
    if (!selected || !selectedElement || design[selected.side].length >= 100) return;
    const id = `custom-${crypto.randomUUID()}`;
    changeList(selected.side, [
      ...design[selected.side],
      {
        ...selectedElement,
        id,
        label: `${selectedElement.label.slice(0, 80)} copy`,
        x: Math.min(900 - selectedElement.width, selectedElement.x + 16),
        y: Math.min(600 - selectedElement.height, selectedElement.y + 16),
        locked: false,
      },
    ]);
    setSelected({ side: selected.side, id });
  }
  return {
    workspace: present,
    design,
    selected,
    selectedElement,
    editing,
    setEditing,
    setSelected,
    update,
    add,
    remove,
    duplicate,
    reorder,
    ready,
    saved,
    setTemplate: (template: TemplateId) => {
      dispatch({ type: "replace", value: { ...present, template } });
      setSelected(null);
    },
    setBackground: (side: DesignSide, color: string) =>
      dispatch({
        type: "replace",
        value: {
          ...present,
          drafts: { ...present.drafts, [present.template]: { ...design, [`${side}Color`]: color } },
        },
      }),
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    startGesture: () => {
      gesture.current = present;
    },
    finishGesture: (cancel = false) => {
      if (gesture.current) {
        dispatch(
          cancel
            ? { type: "preview", value: gesture.current }
            : { type: "commit", previous: gesture.current },
        );
        gesture.current = null;
      }
    },
    reset: () => {
      const value = createWorkspace();
      dispatch({ type: "hydrate", value });
      setSelected(null);
      setSaved(saveDesign(value));
    },
  };
}
export type DesignerController = ReturnType<typeof useDesigner>;
