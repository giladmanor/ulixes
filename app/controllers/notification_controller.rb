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
    
    
    @data +=[{"lang"=>params[:language]}] if params[:language].present?
    @data.delete_at(params[:remove_index].to_i) if params[:remove_index].present?
    logger.debug "+++ #{@data}"
    view = "#{@notification.format}_#{@notification.multilang ? "multilang" : "single_lang"}".to_sym
    
    render view, :layout=>false
  end
  
  def remove_language_entry
    
  end
  
  def set
    #return unless params[:id].present?
    view = params[:id].present? ? :list : :show  
    logger.debug view
    entity = params[:id].present? ? Notification.find(params[:id]) : Notification.new 
    entity.set(params.except(:id))
    if Notification.attribute_method?('account')
      entity.account = @user.account
    end
    
    
    if entity.save
      @info = "#{@entity} saved"  
    else
      @error = "Server error: #{entity.errors.messages.values.join(', ')}"
    end
    redirect_to "/#{view}/Notification/#{entity.id}"#:action=>view, :entity=>Notification, :info=>@info, :error=>@error, :id=>entity.id
  end
  
  
end
