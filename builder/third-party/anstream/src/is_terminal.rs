pub trait IsTerminal {
    fn is_terminal(&self) -> bool;
}

impl IsTerminal for std::io::Stdout {
    #[inline]
    fn is_terminal(&self) -> bool {
        std::io::IsTerminal::is_terminal(self)
    }
}

impl IsTerminal for std::io::StdoutLock<'static> {
    #[inline]
    fn is_terminal(&self) -> bool {
        std::io::IsTerminal::is_terminal(self)
    }
}

impl IsTerminal for std::io::Stderr {
    #[inline]
    fn is_terminal(&self) -> bool {
        std::io::IsTerminal::is_terminal(self)
    }
}

impl IsTerminal for std::io::StderrLock<'static> {
    #[inline]
    fn is_terminal(&self) -> bool {
        std::io::IsTerminal::is_terminal(self)
    }
}

#[cfg(all(windows, feature = "wincon"))]
impl IsTerminal for anstyle_wincon::Console<std::io::Stdout> {
    #[inline]
    fn is_terminal(&self) -> bool {
        self.is_terminal()
    }
}

#[cfg(all(windows, feature = "wincon"))]
impl IsTerminal for anstyle_wincon::Console<std::io::StdoutLock<'static>> {
    #[inline]
    fn is_terminal(&self) -> bool {
        self.is_terminal()
    }
}

#[cfg(all(windows, feature = "wincon"))]
impl IsTerminal for anstyle_wincon::Console<std::io::Stderr> {
    #[inline]
    fn is_terminal(&self) -> bool {
        self.is_terminal()
    }
}

#[cfg(all(windows, feature = "wincon"))]
impl IsTerminal for anstyle_wincon::Console<std::io::StderrLock<'static>> {
    #[inline]
    fn is_terminal(&self) -> bool {
        self.is_terminal()
    }
}

impl IsTerminal for std::fs::File {
    #[inline]
    fn is_terminal(&self) -> bool {
        std::io::IsTerminal::is_terminal(self)
    }
}
