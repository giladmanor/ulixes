require 'net/http'
class WbController < AdminController
  before_filter :callback_data
  
  
  def map_lists
    d = open "#{@callback_url}/persistence/get_map_lists/"
    @map_lists = JSON.parse(d.read)
    logger.debug @map_lists.inspect
  end
  
  def show_map_list
    d = open "#{@callback_url}/persistence/get_map_list/#{params[:id]}"
    @map_list = JSON.parse(d.read)
  end
  
  def set_map_list
    logger.debug params[:ids].reject{|m| m.empty?}
    data = {
      :id=>params[:id],
      :name=>params[:name],
      "ids[]"=>params[:ids].reject{|m| m.empty?}
    }.merge(@callback_auth)
    
    uri = URI.parse("#{@callback_url}/persistence/set_map_list/")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.scheme == 'https'
    response = Net::HTTP.post_form(uri, data)
    if params[:what]=="save"
      redirect_to :action=>:show_map_list, :id=>params[:id]
    else
      redirect_to :action=>:map_lists
    end
    
  end
  
  private
  
  def callback_data
    logger.debug "-"*50
    @callback_url =  @account.conf[:callback_url]
    @callback_auth = {@account.conf[:callback_key_name].to_sym=>@account.conf[:callback_key_value]}
    #logger.debug @callback_auth.inspect
    logger.debug "-"*50
  end
  
  
end