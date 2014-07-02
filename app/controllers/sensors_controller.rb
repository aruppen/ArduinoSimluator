class SensorsController < ApplicationController
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }

  def index
  end

  def forwardSensorValues
    puts "This is my params: "+params["data"]["temperature"].to_s
    rp = params["data"]["temperature"].to_i + 1
    respond_to do |format|
      format.json {render :json => { :value => rp }.to_json}
    end
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
