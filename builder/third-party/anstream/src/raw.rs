use crate::IsTerminal;

/// Required functionality for underlying [`std::io::Write`] for adaptation
#[cfg(not(all(windows, feature = "wincon")))]
pub trait RawStream: std::io::Write + IsTerminal + private::Sealed {}

/// Required functionality for underlying [`std::io::Write`] for adaptation
#[cfg(all(windows, feature = "wincon"))]
pub trait RawStream:
    std::io::Write + IsTerminal + anstyle_wincon::WinconStream + private::Sealed
{
}

impl RawStream for std::io::Stdout {}

impl RawStream for std::io::StdoutLock<'static> {}

impl RawStream for std::io::Stderr {}

impl RawStream for std::io::StderrLock<'static> {}

impl RawStream for std::fs::File {}

impl RawStream for crate::Buffer {}

mod private {
    pub trait Sealed {}

    impl Sealed for std::io::Stdout {}

    impl Sealed for std::io::StdoutLock<'static> {}

    impl Sealed for std::io::Stderr {}

    impl Sealed for std::io::StderrLock<'static> {}

    impl Sealed for std::fs::File {}

    impl Sealed for crate::Buffer {}
}
