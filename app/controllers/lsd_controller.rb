class LsdController < AdminController
  before_filter :entity_filter
  
  def list
    cond = params[:id].present? ? ["name like ?","%#{params[:id]}%"] : "1=1"
    
    if @entity.attribute_method?('account')
      @entities=@entity.find(:all,:conditions=>cond).select{|e| e.account_id==@user.account.id};
    else
      @entities=@entity.find(:all,:conditions=>cond);
    end
    
    @result_size = @entities.size
    @entities = @entities.take(30)
    
    if @entity.new.respond_to?("upload_image")
      logger.debug "##grid##"*10
      render :grid
    else
      logger.debug "--list--"*10
      render :list
    end 
  end
  
  def show
    #do nothing, just show the fricking form
  end
  
  def set
    #return unless params[:id].present?
    
    entity = params[:id].present? ? @entity.find(params[:id]) : @entity.new 
    entity.set(params.except(:id))
    if @entity.attribute_method?('account')
      entity.account = @user.account
    end
    
    
    if entity.save
      @info = "#{@entity} saved"  
    else
      @error = "Server error: #{entity.errors.messages.values.join(', ')}"
    end
    redirect_to :action=>:list, :entity=>@entity, :info=>@info, :error=>@error
  end
  
  def delete
    @entity.find(params[:id]).destroy
    redirect_to :action=>:list,  :info=>"#{@entity} with id #{params[:id]} Permanently deleted",  :entity=>params[:entity]
  end
  
  
  
  private 
  
  def entity_filter
    @entity = params[:entity].singularize.camelize.constantize
  end
  
end
