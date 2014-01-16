class NotificationController < AdminController



  def show
    @notification = params[:id].present? ? @account.notifications.find(params[:id]) : Notification.new
  end
  
  def check_name
    notification = @account.notifications.find_by_name(params[:name])
    logger.debug (notification.nil? || notification.id==params[:id])
    
    render :json => {:valid=>(notification.nil? || notification.id==params[:id])}
  end
  
  
  
end
