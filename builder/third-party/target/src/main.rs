fn main() {
  println!("arch: {}", target::arch());
  println!("os: {}", target::os());
  println!("family: {}", target::family());
  println!("env: {}", target::env());
  println!("endian: {}", target::endian());
  println!("pointer_width: {}", target::pointer_width());
  println!("vendor: {}", target::vendor());
  println!("feature: {:?}", target::features());
}
