# CampusCares V2 end-to-end API test (Phases 1-10)
$ErrorActionPreference = "Stop"
$base = "http://localhost:8080/api"
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$donorEmail = "e2e.donor.$ts@test.edu"
$recipientEmail = "e2e.recipient.$ts@test.edu"
$donorPass = "testpass123"
$recipientPass = "testpass123"

function Invoke-Api {
    param($Method, $Path, $Query, $Body)
    $uri = "$base$Path"
    if ($Query) {
        $qs = ($Query.GetEnumerator() | ForEach-Object { "$($_.Key)=$([uri]::EscapeDataString([string]$_.Value))" }) -join "&"
        $uri += "?$qs"
    }
    $params = @{ Uri = $uri; Method = $Method; ContentType = "application/json" }
    if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 6) }
    return Invoke-RestMethod @params
}

Write-Host "=== Register DONOR ===" -ForegroundColor Cyan
$r1 = Invoke-Api POST "/auth/register" $null @{
    fullName = "E2E Donor"; email = $donorEmail; password = $donorPass; role = "DONOR"
}
if (-not $r1.success) { throw $r1.message }

Write-Host "=== Register RECIPIENT ===" -ForegroundColor Cyan
$r2 = Invoke-Api POST "/auth/register" $null @{
    fullName = "E2E Recipient"; email = $recipientEmail; password = $recipientPass; role = "RECIPIENT"
}
if (-not $r2.success) { throw $r2.message }

Write-Host "=== Submit donation ===" -ForegroundColor Cyan
$donation = Invoke-Api POST "/donations/submit" @{ role = "DONOR" } @{
    donorName = "E2E Donor"; donorEmail = $donorEmail
    itemName = "Java Programming Book"; category = "BOOKS"
    itemCondition = "SLIGHTLY_USED"; quantity = 2
    description = "E2E test donation"
}
if (-not $donation.success) { throw $donation.message }
$donationId = $donation.data.id
Write-Host "Donation ID: $donationId Status: $($donation.data.status)"

Write-Host "=== Donor history PENDING ===" -ForegroundColor Cyan
$history = Invoke-Api GET "/donations/by-donor" @{ donorEmail = $donorEmail }
$pending = $history.data | Where-Object { $_.itemName -eq "Java Programming Book" -and $_.status -eq "PENDING" }
if (-not $pending) { throw "Donor history missing PENDING Java Programming Book" }

Write-Host "=== Donor dashboard stats ===" -ForegroundColor Cyan
$donorDash = Invoke-Api GET "/dashboard/donor" @{ donorEmail = $donorEmail }
if ($donorDash.data.pendingDonations -lt 1) { throw "Donor dashboard pending count not updated" }

Write-Host "=== Admin pending donations ===" -ForegroundColor Cyan
$pendingList = Invoke-Api GET "/donations/pending" @{ role = "ADMIN" }
$foundPending = $pendingList.data | Where-Object { $_.id -eq $donationId }
if (-not $foundPending) { throw "Admin pending list missing donation $donationId" }

Write-Host "=== Approve donation ===" -ForegroundColor Cyan
$approved = Invoke-Api PUT "/donations/approve/$donationId" @{ role = "ADMIN" } $null
if (-not $approved.success) { throw $approved.message }

Write-Host "=== Inventory has book ===" -ForegroundColor Cyan
$inv = Invoke-Api GET "/inventory/search" @{ keyword = "Java Programming Book" }
$book = $inv.data | Where-Object { $_.itemName -like "*Java Programming Book*" -and $_.quantityAvailable -ge 2 }
if (-not $book) { throw "Inventory missing Java Programming Book with qty >= 2" }
$qtyBefore = ($book | Select-Object -First 1).quantityAvailable
Write-Host "Inventory qty before release: $qtyBefore"

Write-Host "=== Donor notification ===" -ForegroundColor Cyan
$donorNotif = Invoke-Api GET "/notifications/user" @{ email = $donorEmail }
if (-not ($donorNotif.data | Where-Object { $_.type -match "DONATION" })) { Write-Warning "Donor notification not found (may use different type)" }

Write-Host "=== Transaction logs ===" -ForegroundColor Cyan
$logs = Invoke-Api GET "/logs" $null
if (-not ($logs.data | Where-Object { $_.action -eq "DONATION_APPROVED" })) { Write-Warning "DONATION_APPROVED log not found in recent logs" }

Write-Host "=== Recipient inventory ===" -ForegroundColor Cyan
$recInv = Invoke-Api GET "/inventory/all" $null
$recBook = $recInv.data | Where-Object { $_.itemName -like "*Java Programming Book*" -and $_.quantityAvailable -gt 0 }
if (-not $recBook) { throw "Recipient inventory missing Java Programming Book" }

Write-Host "=== Submit request ===" -ForegroundColor Cyan
$req = Invoke-Api POST "/requests/submit" @{ role = "RECIPIENT" } @{
    studentName = "E2E Recipient"; studentEmail = $recipientEmail
    requestedItemName = "Java Programming Book"; category = "BOOKS"
    reason = "Need for CS course E2E test"
}
if (-not $req.success) { throw $req.message }
$requestId = $req.data.id
Write-Host "Request ID: $requestId"

Write-Host "=== Recipient history PENDING ===" -ForegroundColor Cyan
$recHist = Invoke-Api GET "/requests/by-student" @{ studentEmail = $recipientEmail }
$pendReq = $recHist.data | Where-Object { $_.id -eq $requestId -and $_.status -eq "PENDING" }
if (-not $pendReq) { throw "Recipient request history missing PENDING" }

Write-Host "=== Admin pending requests ===" -ForegroundColor Cyan
$pendReqs = Invoke-Api GET "/requests/pending" $null
if (-not ($pendReqs.data | Where-Object { $_.id -eq $requestId })) { throw "Admin pending requests missing $requestId" }

Write-Host "=== Approve request ===" -ForegroundColor Cyan
$apprReq = Invoke-Api PUT "/requests/approve/$requestId" @{ role = "ADMIN" } $null
if (-not $apprReq.success) { throw $apprReq.message }

$invAfterApprove = Invoke-Api GET "/inventory/search" @{ keyword = "Java Programming Book" }
$qtyAfterApprove = ($invAfterApprove.data | Select-Object -First 1).quantityAvailable
if ($qtyAfterApprove -ne $qtyBefore) { throw "Inventory changed on approve ($qtyAfterApprove vs $qtyBefore)" }
Write-Host "Inventory unchanged after approve: OK ($qtyAfterApprove)"

Write-Host "=== Release item ===" -ForegroundColor Cyan
$release = Invoke-Api POST "/distributions/release" @{ role = "ADMIN" } @{
    requestId = $requestId
    recipientName = "E2E Recipient"; recipientEmail = $recipientEmail
    itemName = "Java Programming Book"; quantityReleased = 1; remarks = "E2E release"
}
if (-not $release.success) { throw $release.message }

$invAfterRelease = Invoke-Api GET "/inventory/search" @{ keyword = "Java Programming Book" }
$qtyAfterRelease = ($invAfterRelease.data | Select-Object -First 1).quantityAvailable
if ($qtyAfterRelease -ge $qtyAfterApprove) { throw "Inventory did not decrease after release ($qtyAfterRelease)" }
Write-Host "Inventory after release: $qtyAfterRelease (was $qtyAfterApprove)"

$reqAfter = Invoke-Api GET "/requests/all" $null
$released = $reqAfter.data | Where-Object { $_.id -eq $requestId -and $_.status -eq "RELEASED" }
if (-not $released) { throw "Request not RELEASED" }

$dists = Invoke-Api GET "/distributions/all" $null
if (-not ($dists.data | Where-Object { $_.itemName -like "*Java*" })) { throw "Distribution record missing" }

$recNotif = Invoke-Api GET "/notifications/user" @{ email = $recipientEmail }
if (-not $recNotif.data) { Write-Warning "Recipient notifications empty" }

Write-Host "`n=== ALL E2E API TESTS PASSED ===" -ForegroundColor Green
