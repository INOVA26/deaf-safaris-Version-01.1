$ErrorActionPreference = 'Stop'
$credential = [Console]::ReadLine() | ConvertFrom-Json
if ($credential.remote_url -notmatch '^https://git\.chatgpt-team\.site/') {
    throw 'Unexpected source repository host.'
}
$start = [System.Diagnostics.ProcessStartInfo]::new()
$start.FileName = 'git'
$start.UseShellExecute = $false
$start.WorkingDirectory = (Get-Location).Path
$start.ArgumentList.Add('push')
$start.ArgumentList.Add($credential.remote_url)
$start.ArgumentList.Add("HEAD:$($credential.branch)")
# Keep the short-lived credential in the child environment, never in Git config.
$start.Environment['GIT_CONFIG_COUNT'] = '1'
$start.Environment['GIT_CONFIG_KEY_0'] = "http.$($credential.remote_url).extraHeader"
$start.Environment['GIT_CONFIG_VALUE_0'] = "Authorization: Bearer $($credential.token)"
$start.Environment['GIT_TERMINAL_PROMPT'] = '0'
$process = [System.Diagnostics.Process]::Start($start)
$process.WaitForExit()
exit $process.ExitCode
