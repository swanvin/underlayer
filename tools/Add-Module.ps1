# === Add-Module v1.0 (CANONICAL) ===
# Save as: C:\SwanLabs\Underlayer\underlayer\tools\Add-Module.ps1
# Run from app root: C:\SwanLabs\Underlayer\underlayer

param(
  [Parameter(Mandatory=$true)][int]$Id,
  [Parameter(Mandatory=$true)][string]$Slug,
  [Parameter(Mandatory=$true)][string]$Name,
  [Parameter(Mandatory=$true)][string]$LawTitle,
  [Parameter(Mandatory=$true)][string]$LawStatement,
  [string]$Summary = "",
  [string[]]$Does = @("Measures one thing precisely."),
  [string[]]$DoesNot = @("No custody","No transfers","No advice","No guarantees"),
  [ValidateSet("SPEC","LIVE","COMING")][string]$Status = "SPEC",
  [string]$Route = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# -------------------------
# Helpers
# -------------------------
function Ensure-Dir([string]$p) {
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}

function Read-All([string]$p) { Get-Content -Raw -Path $p }

function Write-All([string]$p, [string]$c) {
  $dir = Split-Path $p -Parent
  if ($dir) { Ensure-Dir $dir }
  Set-Content -Encoding UTF8 -Path $p -Value $c
}

# Safe JS/TS literals via JSON (no manual escaping, avoids backtick hell)
function Js([string]$s) { return ($s | ConvertTo-Json -Compress) }
function JsArr([string[]]$a) { return ($a | ConvertTo-Json -Compress) }

# Find insertion point by regex anchor (more robust than searching for '];')
function Insert-Before([string]$text, [string]$pattern, [string]$insert) {
  $m = [regex]::Match($text, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $m.Success) { throw "Insert anchor not found: $pattern" }
  return $text.Substring(0, $m.Index) + $insert + $text.Substring($m.Index)
}

# -------------------------
# Resolve paths (ABSOLUTE)
# -------------------------
$AppRoot = (Get-Location).Path
$ToolsRoot = Join-Path $AppRoot "tools"
$RegistryPath = Join-Path $AppRoot "src\lib\modules\registry.ts"
$ModulesDir = Join-Path $AppRoot "src\app\`(site`)\modules"

if (-not (Test-Path $RegistryPath)) { throw "registry.ts not found: $RegistryPath" }
if (-not (Test-Path (Join-Path $AppRoot "src\app\`(site`)"))) { throw "Expected app dir missing: src\app\(site)" }

# Normalize inputs
$Slug = $Slug.ToLowerInvariant().Trim()
$IdStr = $Id.ToString("000")
$SummaryFinal = if ($Summary -and $Summary.Trim().Length -gt 0) { $Summary } else { "$Name exposes $LawTitle." }

# -------------------------
# 1) Create module page
# -------------------------
$ModulePageDir = Join-Path $ModulesDir $Slug
Ensure-Dir $ModulePageDir

$tsxTemplate = @'
import Container from "@/components/Container";
import RuleLine from "@/components/RuleLine";
import { getModule } from "@/lib/modules/registry";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function ModuleDetail() {
  const mod = getModule("__SLUG__");
  if (!mod) return notFound();

  return (
    <Container>
      <div className="text-xs text-neutral-500">UNDERLAYER · MODULE {mod.id}</div>
      <div className="mt-2 text-3xl">{mod.name}</div>
      <div className="mt-2 text-sm text-neutral-400">{mod.status}</div>

      <RuleLine />

      <div className="text-sm text-neutral-300">{mod.law.title}</div>
      <div className="mt-2 text-sm text-neutral-400">{mod.law.statement}</div>

      <RuleLine />

      <div className="text-sm text-neutral-300">What it measures</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-400 space-y-1">
        {mod.does.map((x) => <li key={x}>{x}</li>)}
      </ul>

      <RuleLine />

      <div className="text-sm text-neutral-300">What it does not do</div>
      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-400 space-y-1">
        {mod.doesNot.map((x) => <li key={x}>{x}</li>)}
      </ul>

      {mod.status === "LIVE" && mod.route ? (
        <>
          <RuleLine />
          <div className="text-sm text-neutral-300">Live tool</div>
          <div className="mt-2">
            <Link className="text-sm underline underline-offset-4" href={mod.route}>
              Open {mod.name}
            </Link>
          </div>
        </>
      ) : null}
    </Container>
  );
}
'@

$tsx = $tsxTemplate.Replace("__SLUG__", $Slug)
Write-All (Join-Path $ModulePageDir "page.tsx") $tsx

# -------------------------
# 2) Patch registry.ts
# -------------------------
$reg = Read-All $RegistryPath

# Reject duplicates (supports either slug: "x" or slug:'x')
if ($reg -match ("slug\s*:\s*['""]" + [regex]::Escape($Slug) + "['""]")) {
  throw "Module slug '$Slug' already exists in registry.ts"
}

$routeLine = ""
if ($Status -eq "LIVE" -and $Route -and $Route.Trim().Length -gt 0) {
  $routeLine = "`n    route: " + (Js $Route) + ","
}

$newObj = @"
  {
    id: $(Js $IdStr),
    slug: $(Js $Slug),
    name: $(Js $Name),
    status: $(Js $Status),
    law: { title: $(Js $LawTitle), statement: $(Js $LawStatement) },
    summary: $(Js $SummaryFinal),
    does: $(JsArr $Does),
    doesNot: $(JsArr $DoesNot),$routeLine
  },
"@

# Anchor strategy: insert just before the modules array closes.
# Works for common patterns:
#   export const modules = [ ... ];
#   const MODULES = [ ... ];
#   export const registry = [ ... ];
# We find the LAST occurrence of "];" that closes an array and insert before it.
$anchor = "];"
$idx = $reg.LastIndexOf($anchor)
if ($idx -lt 0) {
  # fallback: insert before last "]" then ";"
  $idx2 = $reg.LastIndexOf("]")
  if ($idx2 -lt 0) { throw "Could not find array closing bracket in registry.ts" }
  $reg2 = $reg.Substring(0, $idx2) + "`n" + $newObj + "`n" + $reg.Substring($idx2)
  Write-All $RegistryPath $reg2
} else {
  $reg2 = $reg.Substring(0, $idx) + "`n" + $newObj + "`n" + $reg.Substring($idx)
  Write-All $RegistryPath $reg2
}

# -------------------------
# Output
# -------------------------
Write-Host "=== Add-Module v1.0 COMPLETE ==="
Write-Host ("Module: {0} {1} ({2})" -f $IdStr, $Name, $Slug)
Write-Host ("Page:   src\app\(site)\modules\{0}\page.tsx" -f $Slug)
Write-Host "Registry patched: src\lib\modules\registry.ts"
