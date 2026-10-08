$site = "https://ai-council-one-livid.vercel.app"
$tmp = $env:TEMP

Write-Host "--- waiting for the new Vercel deployment (robots.txt is the tell) ---"
$deadline = (Get-Date).AddMinutes(6)
$deployed = $false
while ((Get-Date) -lt $deadline) {
  $code = & curl.exe -sS -m 20 -o "$tmp\v-robots.txt" -w "%{http_code}" "$site/robots.txt"
  if ($code -eq "200") { $deployed = $true; break }
  Start-Sleep -Seconds 10
}
if (-not $deployed) { Write-Host "DEPLOY NOT DETECTED in 6 min (last=$code)"; exit 1 }
Write-Host "new deployment is live"
Write-Host ""

function Probe($name, $path, $expect, $method = "GET", $extra = @()) {
  $args = @("-sS", "-m", "40", "-o", "$tmp\v-body", "-w", "%{http_code}|%{redirect_url}|%{time_total}")
  foreach ($e in $extra) { $args += $e }
  $r = & curl.exe @args "$site$path"
  $parts = $r -split "\|"
  $status = $parts[0]
  $redir  = $parts[1]
  $ok = if ($expect -contains $status) { "PASS" } else { "FAIL" }
  "{0,-6} {1,-38} status={2,-4} expect={3,-10} {4}" -f $ok, $path, $status, ($expect -join "/"), $redir
}

Write-Host "=== Round A: Google can find you ==="
Probe "404"      "/this-page-does-not-exist"            @("404")
Probe "404-typo" "/faq/typo"                            @("404")
Probe "sitemap"  "/sitemap.xml"                         @("200")
Probe "robots"   "/robots.txt"                          @("200")
foreach ($p in @("/", "/login", "/signup", "/privacy", "/faq")) { Probe "route" $p @("200") }
Probe "council"  "/council"                             @("200")

Write-Host ""
Write-Host "=== Round B: looks right when shared ==="
Probe "og-image" "/og-image.png"                        @("200")
Probe "favicon"  "/favicon.svg"                         @("200")
& curl.exe -sS -m 30 "$site/" -o "$tmp\v-home.html"
$html = Get-Content -Raw "$tmp\v-home.html"
foreach ($tag in @("og:image", "og:title", "og:url", "twitter:card", "twitter:image", "canonical", "name=`"description`"")) {
  $hit = $html -match [regex]::Escape($tag)
  "{0,-6} {1}" -f $(if ($hit) { "PASS" } else { "FAIL" }), $tag
}

Write-Host ""
Write-Host "=== Round C/D: robots safety + HTTPS ==="
$robots = Get-Content -Raw "$tmp\v-robots.txt"
if ($robots -match "Disallow:\s*/\s*$") { "FAIL   robots has blanket Disallow: /" } else { "PASS   no blanket Disallow: /" }
if ($robots -match "Sitemap:") { "PASS   robots points to sitemap" } else { "FAIL   no sitemap line" }

foreach ($p in @("/", "/privacy")) {
  $r = & curl.exe -sS -m 30 -o NUL -w "%{http_code}|%{redirect_url}" "http://ai-council-one-livid.vercel.app$p"
  $parts = $r -split "\|"
  $ok = if ($parts[0] -eq "308" -or $parts[1] -like "https://*") { "PASS" } else { "FAIL" }
  "{0,-6} http{1} -> {2} ({3})" -f $ok, $p, $parts[1], $parts[0]
}
