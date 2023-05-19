use std::process::Command;


fn main() {
    // println!("Hello, world!");

    // TODO: start up command line control with rotctl
    // https://doc.rust-lang.org/std/process/struct.Command.html
    Command::new("rotctl");
    // .spawn -> returns a handle, doesn't wait
    // .status -> returns process result, waits for process to end
    // TODO: set up communication methods to 
    // possibly will need two threads to properly facilitate this
    // may need multiple senders
}
