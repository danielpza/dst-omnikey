workflow "New workflow" {
  on = "push"
  resolves = ["Release"]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "On Branch Master" {
  uses = "actions/bin/filter@0dbb077f64d0ec1068a644d25c71b1db66148a24"
  needs = ["Install"]
  args = "branch master"
}

action "Release" {
  uses = "toolmantim/release-drafter@v5.2.0"
  needs = ["On Branch Master"]
  secrets = ["GITHUB_TOKEN"]
}
