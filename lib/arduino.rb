module Arduino
"""
Courtesy of https://github.com/hparra/ruby-serialport/issues/25
https://github.com/hparra/ruby-serialport/issues/25#issuecomment-45653016
by https://github.com/theboozler
"""
require 'serialport'

class Arduino
  def initialize(port="/home/ruppena/COM2", baud=9600)
    @serial_port = SerialPort.new(port, baud)#, 8, 1, SerialPort::NONE)
    #sleep 5
    @lastline = "{}"
  end

  def write(cmd)
    @serial_port.puts cmd
  end

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