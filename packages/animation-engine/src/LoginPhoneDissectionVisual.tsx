"use client";

import React from "react";
import {
  LoginRotatingProductVisual,
  LoginRotatingProductVisualProps,
} from "./LoginRotatingProductVisual.js";

// Re-export LoginRotatingProductVisual under the previous name to ensure zero dissection imagery
export function LoginPhoneDissectionVisual(props: LoginRotatingProductVisualProps) {
  return <LoginRotatingProductVisual {...props} />;
}
