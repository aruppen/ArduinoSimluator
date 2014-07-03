require 'serialport'
require 'arduino'


class SensorsController < ApplicationController
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }
  @@sockets = Hash.new
  @@socats = Hash.new

  before_filter :init_socket
  def init_socket
  end

  def index
  end

  # Forwards the received values of one instantiated Arduino sketch as JSON on
  # the selected serial port. Ideally, the REST-server listens on this serial
  # port and makes so these values accessible for clients over a REST-interface.
  def forwardSensorValues
    logger.debug  "This is my params: "+params["data"]["temperature"].to_s
    logger.debug "This is my params: "+params["data"]["temperature"].to_s
    rp = params["data"]["temperature"].to_i + 1
    respond_to do |format|
      format.json {render :json => { :value => rp }.to_json}
    end
    if !@@sockets[params["serialPort"]]
      create_socket(params["serialPort"])
    end
    @@sockets[params["serialPort"]].write(params["data"])
  end

  # For a given serial port, returns the last new received line.
  def getLastReadLine
    sp = params["sp"].to_s
    begin
      nextline = @@sockets[sp].next
    rescue NoMethodError
      nextline = "{}"
    end
    logger.debug  nextline
    json_line = JSON.parse(nextline, symbolize_names: true)

    respond_to do |format|
      format.json {render :json => {:serialPort => sp, :data => json_line}.to_json}
    end
  end

  # Method used to send back the desired Arduino sketch so it can be added to the list of instantiated Arduino
  # sketches in the interface. This is a function which is called from javascript over an
  # Ajax action. The result is just a bunch of HTML rendered as string and packaged into a JSON array.
  def addArduino
    type = params["type"].to_s
    logger.debug  "Will create "+type
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

  private

  # Utility Method to create an instance of socat with the chosen port on one side and the chosen port+1 on
  # the output side.
  # Params:
  # +port+:: the port name on the one side of the socat channel
  # Example:
  #  create_socket('COM1') => creates a socat between COM1 and COM2
  def create_socket(port) #:doc:
    splitted = port.split(//)
    splitted[splitted.size - 1] = (splitted[splitted.size - 1].to_i + 1).to_s
    port2 = splitted.join()
    port_str = "/home/ruppena/"  #may be different for you

    @@socats[port] = IO.popen('socat -d -d pty,raw,echo=0,link='+port_str+port+' pty,raw,echo=0,link='+port_str+port2)
    sleep(2)
    @@sockets[params["serialPort"]] = Arduino::Arduino.new(port_str+port)
    @@sockets[params["serialPort"]].read
    return 0
  end
end
