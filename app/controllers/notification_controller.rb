class NotificationController < AdminController



  def show
    @notification = params[:id].present? ? @account.notifications.find(params[:id]) : Notification.new
  end
  
  
  
end
