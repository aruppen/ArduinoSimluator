class SensorsController < ApplicationController
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }

  def index
  end

  def forwardSensorValues
    puts "This is my params: "+params["temp"].to_s
    rp = params["temp"].to_i + 1
    respond_to do |format|
      format.json {render :json => { :value => rp }.to_json}
    end
  end
end
