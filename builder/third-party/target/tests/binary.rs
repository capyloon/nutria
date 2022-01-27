extern crate executable_path;
use executable_path::executable_path;
use std::process::Command;

#[cfg(all(target_arch = "x86_64", target_os = "linux", target_env = "gnu"))]
static EXPECTED: &str = r#"arch: x86_64
os: linux
family: unix
env: gnu
endian: little
pointer_width: 64
vendor: unknown
feature: ["fxsr", "sse", "sse2"]
"#;

#[cfg(all(target_arch = "x86_64", target_os = "windows", target_env = "msvc"))]
static EXPECTED: &str = r#"arch: x86_64
os: windows
family: windows
env: msvc
endian: little
pointer_width: 64
vendor: pc
feature: ["fxsr", "sse", "sse2"]
"#;

#[cfg(all(target_arch = "x86_64", target_os = "macos", target_env = ""))]
static EXPECTED: &str = r#"arch: x86_64
os: macos
family: unix
env: 
endian: little
pointer_width: 64
vendor: apple
feature: ["fxsr", "sse", "sse2", "sse3", "ssse3"]
"#;

#[test]
fn binary_output() {
  let output = Command::new(executable_path("target"))
    .output()
    .unwrap()
    .stdout;
  let output = std::str::from_utf8(&output).unwrap();
  pretty_assertions::assert_eq!(output, EXPECTED);
}
