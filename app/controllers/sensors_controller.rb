require 'serialport'

class SensorsController < ApplicationController
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }
  @@sockets = Hash.new
  @@socats = Hash.new




  before_filter :init_socket
  def init_socket
    #params for serial port
    port_str = "/home/ruppena/COM1"  #may be different for you
    baud_rate = 9600
    data_bits = 8
    stop_bits = 1
    parity = SerialPort::NONE

    #@sp = SerialPort.new(port_str, baud_rate, data_bits, stop_bits, parity)


  end

  def index
  end

  def create_socket(port)
    splitted = port.split(//)
    splitted[splitted.size - 1] = (splitted[splitted.size - 1].to_i + 1).to_s
    port2 = splitted.join()
    @@socats[port] = IO.popen('socat -d -d pty,raw,echo=0,link=$HOME/'+port+' pty,raw,echo=0,link=$HOME/'+port2)
    sleep(2)
    port_str = "/home/ruppena/"  #may be different for you
    baud_rate = 9600
    data_bits = 8
    stop_bits = 1
    parity = SerialPort::NONE

    @@sockets[params["serialPort"]] = SerialPort.new(port_str+port, baud_rate, data_bits, stop_bits, parity)
    return 0
  end

  def forwardSensorValues
    puts "This is my params: "+params["data"]["temperature"].to_s
    rp = params["data"]["temperature"].to_i + 1
    respond_to do |format|
      format.json {render :json => { :value => rp }.to_json}
    end
    if !@@sockets[params["serialPort"]]
      create_socket(params["serialPort"])
    end
    @@sockets[params["serialPort"]].puts(params["data"])
    #@sp.puts(params["data"])
  end

  def addArduino
    type = params["type"].to_s
    puts "Will create "+type
    arduinoNumber = rand(9999999)
    case type
    when 'dht11'
      arduinoPart = 'sensors/dht11'
    when 'light'
      arduinoPart = 'sensors/light'
      when 'led'
        arduinoPart = 'sensors/led'
      when 'switch'
        arduinoPart = 'sensors/switch'
      when 'motor'
        arduinoPart = 'sensors/motor'
      when 'lightbulb'
        arduinoPart = 'sensors/lightbulb'
      else
        arduinoPart = 'sensors/dht11'
    end

    respond_to do |format|
      format.json {render :json => { :value => render_to_string(:partial => arduinoPart, :formats => [:html], :layout => false, :locals => {:arduinoNumber => arduinoNumber}) }.to_json}

    end
  end
end
