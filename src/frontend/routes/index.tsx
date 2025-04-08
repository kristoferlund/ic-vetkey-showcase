import { Link, createFileRoute } from "@tanstack/react-router";

import { Timer } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="text-lg flex flex-col gap-5">
      <div>
        VetKeys - Verifiable Encrypted Threshold Key - on the Internet Computer
        addresses the fundamental challenge of storing secrets on-chain by
        allowing cryptographic key derivation without exposing private keys.
      </div>
      <div>This showcase app demostrates some use cases of VetKeys:</div>
      <Link to="/timelock">
        <div className="flex items-center gap-4 border p-5 rounded-md bg-white/10 hover:bg-white/20">
          <Timer className="w-12 h-12 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h2>Timelock</h2>
            <div className="text-sm text-gray-400">
              Encrypt a message and set a release time
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-4 border p-5 rounded-md bg-white/10 hover:bg-white/20">
        <div className="text-sm text-gray-300">(more examples coming)</div>
      </div>
      <h2>Links</h2>

      <div>
        <a
          href="https://github.com/kristoferlund/ic-vetkey-showcase"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          ic-vetkey-showcase
        </a>{" "}
        – Source code for this showcase app.
      </div>

      <div>
        <a
          href="https://github.com/dfinity/vetkd-devkit"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          VetKeys Devkit
        </a>{" "}
        – Tools designed to help developers integrate VetKeys into their ICP
        applications.
      </div>

      <div>
        <a
          href="https://internetcomputer.org/docs/references/vetkeys-overview/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          VetKeys Reference
        </a>{" "}
        – This page contains a high-level view and description of vetKD and its
        building blocks.
      </div>
    </div>
  );
}
