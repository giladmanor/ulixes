class NotificationController < AdminController



  def show
    @notification = params[:id].present? ? @account.notifications.find(params[:id]) : Notification.new(params[:notification])
  end
  
  def check_name
    notification = @account.notifications.find_by_name(params[:name])
    render :json => {:valid=>(notification.nil? || notification.id==params[:id])}
  end
  
  def get_message_content_form
    @notification = params[:id].present? ? @account.notifications.find(params[:id]) : Notification.new
    @data = params[:data].present? ? params[:data] : (@notification.data || [])
    
    logger.debug "+++ #{@data}"
    @data +=[{:lang=>params[:language]}] if params[:language].present?
    @data.delete_at(params[:remove_index].to_i) if params[:remove_index].present?
    
    view = "#{@notification.format}_#{@notification.multilang ? "multilang" : "single_lang"}".to_sym
    
    render view, :layout=>false
  end
  
  def remove_language_entry
    
  end
  
  
  
end
