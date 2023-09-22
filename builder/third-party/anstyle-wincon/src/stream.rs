/// Extend `std::io::Write` with wincon styling
///
/// Generally, you will want to use [`Console`][crate::Console] instead
pub trait WinconStream {
    /// Change the foreground/background
    ///
    /// A common pitfall is to forget to flush writes to
    /// stdout before setting new text attributes.
    fn set_colors(
        &mut self,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()>;

    /// Get the current foreground/background colors
    fn get_colors(
        &self,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)>;
}

impl WinconStream for std::io::Stdout {
    fn set_colors(
        &mut self,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        inner::set_colors(self, fg, bg)
    }

    fn get_colors(
        &self,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        inner::get_colors(self)
    }
}

impl WinconStream for std::io::StdoutLock<'static> {
    fn set_colors(
        &mut self,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        inner::set_colors(self, fg, bg)
    }

    fn get_colors(
        &self,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        inner::get_colors(self)
    }
}

impl WinconStream for std::io::Stderr {
    fn set_colors(
        &mut self,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        inner::set_colors(self, fg, bg)
    }

    fn get_colors(
        &self,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        inner::get_colors(self)
    }
}

impl WinconStream for std::io::StderrLock<'static> {
    fn set_colors(
        &mut self,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        inner::set_colors(self, fg, bg)
    }

    fn get_colors(
        &self,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        inner::get_colors(self)
    }
}

impl WinconStream for std::fs::File {
    fn set_colors(
        &mut self,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        ansi::set_colors(self, fg, bg)
    }

    fn get_colors(
        &self,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        ansi::get_colors(self)
    }
}

#[cfg(windows)]
mod wincon {
    use std::os::windows::io::AsHandle;

    pub(super) fn set_colors<S: AsHandle>(
        stream: &mut S,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        if let (Some(fg), Some(bg)) = (fg, bg) {
            crate::windows::set_colors(stream, fg, bg)
        } else {
            Ok(())
        }
    }

    pub(super) fn get_colors<S: AsHandle>(
        stream: &S,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        crate::windows::get_colors(stream).map(|(fg, bg)| (Some(fg), Some(bg)))
    }
}

mod ansi {
    pub(super) fn set_colors<S: std::io::Write>(
        stream: &mut S,
        fg: Option<anstyle::AnsiColor>,
        bg: Option<anstyle::AnsiColor>,
    ) -> std::io::Result<()> {
        if let Some(fg) = fg {
            write!(stream, "{}", fg.render_fg())?;
        }
        if let Some(bg) = bg {
            write!(stream, "{}", bg.render_bg())?;
        }
        if fg.is_none() && bg.is_none() {
            write!(stream, "{}", anstyle::Reset.render())?;
        }
        Ok(())
    }

    pub(super) fn get_colors<S>(
        _stream: &S,
    ) -> std::io::Result<(Option<anstyle::AnsiColor>, Option<anstyle::AnsiColor>)> {
        Ok((None, None))
    }
}

#[cfg(not(windows))]
use ansi as inner;
#[cfg(windows)]
use wincon as inner;
