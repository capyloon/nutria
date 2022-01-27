macro_rules! value {
    ($name:ident, $($value:literal,)+) => {
        $(
          #[cfg($name = $value)]
          {
              $value
          }
        )+
    };
}

macro_rules! features {
  ($($feature:literal,)+) => {
    &[
      $(
        #[cfg(target_feature = $feature)]
        $feature,
      )+
    ]
  }
}

pub fn arch() -> &'static str {
  value! {
    target_arch,
    "aarch64",
    "arm",
    "asmjs",
    "avr",
    "hexagon",
    "le32",
    "mips",
    "mips64",
    "msp430",
    "nvptx",
    "nvptx64",
    "powerpc",
    "powerpc64",
    "riscv32",
    "riscv64",
    "s390x",
    "sparc",
    "sparc64",
    "spriv",
    "thumb",
    "wasm32",
    "x86",
    "x86_64",
    "xcore",
  }
}

pub fn endian() -> &'static str {
  value! {
    target_endian,
    "big",
    "little",
  }
}

pub fn env() -> &'static str {
  value! {
    target_env,
    "",
    "gnu",
    "libnx",
    "msvc",
    "musl",
    "newlib",
    "sgx",
    "uclibc",
  }
}

pub fn family() -> &'static str {
  value! {
    target_family,
    "unix",
    "wasm",
    "windows",
  }
}

pub fn features() -> &'static [&'static str] {
  features!(
    "adx",
    "aes",
    "altivec",
    "atomics",
    "avx",
    "avx2",
    "avx512bf16",
    "avx512bitalg",
    "avx512bw",
    "avx512cd",
    "avx512f",
    "avx512gfni",
    "avx512ifma",
    "avx512vaes",
    "avx512vbmi",
    "avx512vl",
    "avx512vnni",
    "avx512vpopcntdq",
    "bmi1",
    "bmi2",
    "cmpxchg16b",
    "crc",
    "f16c",
    "fma",
    "fxsr",
    "lzcnt",
    "msa",
    "neon",
    "pclmulqdq",
    "popcnt",
    "rdrand",
    "rdseed",
    "rtm",
    "sha",
    "simd128",
    "sse",
    "sse2",
    "sse3",
    "sse4.1",
    "sse4.2",
    "sse4a",
    "ssse3",
    "tbm",
    "tme",
    "v7",
    "v8",
    "vsx",
    "xsave",
    "xsavec",
    "xsaveopt",
    "xsaves",
  )
}

// pub fn has_atomic_8() -> bool {
//   cfg!(target_has_atomic = "8")
// }

// pub fn has_atomic_16() -> bool {
//   cfg!(target_has_atomic = "16")
// }

// pub fn has_atomic_32() -> bool {
//   cfg!(target_has_atomic = "32")
// }

// pub fn has_atomic_64() -> bool {
//   cfg!(target_has_atomic = "64")
// }

// pub fn has_atomic_ptr() -> bool {
//   cfg!(target_has_atomic = "ptr")
// }

pub fn os() -> &'static str {
  value! {
    target_os,
    "android",
    "bitrig",
    "cloudabi",
    "cuda",
    "dragonfly",
    "emscripten",
    "freebsd",
    "fuchsia",
    "haiku",
    "hermit",
    "illumos",
    "ios",
    "l4re",
    "linux",
    "macos",
    "netbsd",
    "none",
    "openbsd",
    "psp",
    "redox",
    "sgx",
    "solaris",
    "tvos",
    "vxworks",
    "wasi",
    "watchos",
    "windows",
  }
}

pub fn pointer_width() -> &'static str {
  value! {
    target_pointer_width,
    "8",
    "16",
    "32",
    "64",
  }
}

pub fn test() -> bool {
  cfg!(test)
}

pub fn vendor() -> &'static str {
  if cfg!(target_vendor = "apple") {
    "apple"
  } else if cfg!(target_vendor = "fortanix") {
    "fortanix"
  } else if cfg!(target_vendor = "pc") {
    "pc"
  } else if cfg!(target_vendor = "sun") {
    "sun"
  } else if cfg!(target_vendor = "uwp") {
    "uwp"
  } else {
    "unknown"
  }
}
