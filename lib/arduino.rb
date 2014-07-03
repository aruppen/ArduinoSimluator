module Arduino
"""
Courtesy of https://github.com/hparra/ruby-serialport/issues/25
https://github.com/hparra/ruby-serialport/issues/25#issuecomment-45653016
by https://github.com/theboozler
"""
require 'serialport'

# Reprensents one Arduino and its associated serial bus.
# This class can read and write in a threaded manner on this
# dedicated serial bus.
class Arduino

  # Standard constructor for the Arduino.
  def initialize(port="/home/ruppena/COM2", baud=9600)
    @serial_port = SerialPort.new(port, baud)#, 8, 1, SerialPort::NONE)
    #sleep 5
    @lastline = "{}"
  end

  # Method used to write something on the serial bus.
  #
  # Params:
  # +cmd+:: the string to send
  #
  # Example:
  #  ard = Arduino.new('/dev/pts/com1') => creates an instance of Arduino listen on the serial port /dev/pts/com1
  #  ard.write('{"temperature":"50", "humidity":"20"}') => write the JSON {"temperature":"50", "humidity":"20"}
  def write(cmd)
    @serial_port.puts cmd
  end

  # This method continousely listens on the serial bus. As soon as
  # a new line appears, it is read and stored in the @lastline. This
  # method needs to be called by hand after creating an instance of Arduino
  #
  # Example:
  #  ard = Arduino.new('/dev/pts/com1') => creates an instance of Arduino listen on the serial port /dev/pts/com1
  #  ard.read => launches the reading thread.
  #  #do some other stuff
  def read
    @read_thread = Thread.new do
      loop do
        c = @serial_port.readline("\n")
        c.chomp! #remove carrige return
        if c
          @lastline = c
        end
        sleep 0.005
      end
    end
  end

  # Utility method to return the last read line. To ensure that a message is read at most once, after reading
  # the line is resetted to "{}".
  def next
    message = @lastline
    @lastline = "{}"
    return message
  end
end

# jig = Arduino.new
# jig.read
#
#
# puts "Ready..."
#
# for i in 0..3
#   puts "Yeah..."
#   puts jig.next
#   sleep(5)
# end
#
# for i  in 0..3
#   x = gets
#   puts "Sending message"
#   jig.write "Hello"
#   puts "Sent message"
# end
#
# gets
end