class LsdController < AdminController
  before_filter :entity_filter
  
  def list
    cond = params[:id].present? ? ["name like ?","%#{params[:id]}%"] : "1=1"
    
    if @entity.attribute_method?('account')
      @entities=@entity.find(:all,:conditions=>cond).select{|e| e.account_id==@user.account.id};
    else
      @entities=@entity.find(:all,:conditions=>cond);
    end
    
  end
  
  def set
    return if params[:id]==:new
    
    entity = params[:id].nil? ? @entity.new : @entity.find(params[:id]) 
    attr = params.delete_if{|k,v| !entity.respond_to?(k.to_sym)}
    entity.update_attributes(attr.except(:id))
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
  
  def show
    
  end
  
  private 
  
  def entity_filter
    @entity = params[:entity].singularize.camelize.constantize
  end
  
end
