require "tokenizer.rb"
class ApiController < ApplicationController
  before_filter :auth_filter, :except=>[:use_token]
  after_filter :callback_wrapper #JSONP wrapper
  respond_to :json
  
  SUCCESS = {:success=>true}
  FAIL = {:success=>false}
  
  def get_token
    logger.debug generate_token(@user.id)
    respond_with(generate_token(@user.id))
  end
  
  def use_token
    unless validate_token(params[:t])
      render :file => '/public/404.html', :status => :not_found, :layout => false
      return false
    else
      params[:with_info].present? ? respond_with(@user.spill) : respond_with(SUCCESS)
    end
  end
  
  def create
    if @user.nil? && @account.add_user(uid:params[:uid])
      respond_with(SUCCESS)
    else
      respond_with(FAIL)
    end
  end
  
  def get
    respond_with(@user.spill)
  end
  
  def set
    @user.resolve_event params[:code],params[:value]
    params[:with_info].present? ? respond_with(@user.spill) : respond_with(SUCCESS)
  end
  
  def read
    un = @user.user_notifications.find(params[:id])
    un.read = Time.now
    un.save
    params[:with_info].present? ? respond_with(@user.spill) : respond_with(SUCCESS)
  end
  
  private # private # private # private # private # private # private # private # private # private # 
  
  # FILTER
  def auth_filter
    unless session[:uuid]
      @account = Account.find(params[:a_id])
      unless params[:k]==@account.key || params[:k]==@account.client_key
        render :file => 'public/404.html', :status => :not_found, :layout => false
        return false
      end
      @user = @account.find_user(params[:uuid])
    else
      @user = User.find(session[:uuid])
      @account = @user.account
    end
  end
  
  # FILTER
  def callback_wrapper
    response.body = "#{params[:callback]}(#{response.body});" unless params[:callback].nil?
  end
  
  def generate_token(uuid)
    Tokenizer.get_token(uuid)
  end
  
  def validate_token(token_id)
    uuid = Tokenizer.use_token token_id
    logger.debug "#"*10 + uuid.inspect
    session[:uuid] = uuid
    @user = User.find(session[:uuid]) unless uuid.nil?
  end

end
