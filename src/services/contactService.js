import { hasSupabase, supabase } from "./supabaseClient";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "https://formsubmit.co/ajax/vanuragverma2173@gmail.com";

function storeMessageLocally(payload) {
  const messages = JSON.parse(window.localStorage.getItem("admin_messages") || "[]");
  messages.unshift({
    id: `${Date.now()}`,
    ...payload,
    status: "unread",
    created_at: new Date().toISOString(),
  });
  window.localStorage.setItem("admin_messages", JSON.stringify(messages));
}

async function submitToSupabase(payload) {
  const { error } = await supabase.from("messages").insert([
    {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      status: "unread",
    },
  ]);

  if (error) {
    throw error;
  }
}

async function submitToEndpoint(payload) {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...payload,
      _subject: "Contact Form Submission",
    }),
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }
}

export async function submitContactMessage(payload) {
  if (hasSupabase()) {
    try {
      await submitToSupabase(payload);
      return;
    } catch (error) {
      if (!CONTACT_ENDPOINT) {
        throw error;
      }
    }
  }

  if (CONTACT_ENDPOINT) {
    await submitToEndpoint(payload);
    return;
  }

  storeMessageLocally(payload);
}