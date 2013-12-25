class ApiController < ApplicationController
  before_filter :auth_filter, :except=>[:use_token]
  after_filter :callback_wrapper #JSONP wrapper
  respond_to :json
  
  SUCCESS = {:success=>true}
  FAIL = {:success=>false}
  
  def get_token
    respond_with({:token=>generate_token(params[:uuid])})
  end
  
  def use_token
    unless @user = validate_token(params[:token])
      render :file => '/public/404.html', :status => :not_found, :layout => false
      return false
    else
      params[:with_info].present? ? respond_with(@user.spill) : respond_with(SUCCESS)
    end
  end
  
  def create
    if @user.nil? && @account.add_user(params[:user])
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
  
  private # private # private # private # private # private # private # private # private # private # 
  
  # FILTER
  def auth_filter
    unless session[:uuid]
      @account = Account.find(params[:a_id])
      unless params[:k]==@account.key
        render :file => 'public/404.html', :status => :not_found, :layout => false
        return false
      end
      @user = User.find(params[:uuid])
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
    Tokenizer.get_token({:uuid => uuid})
  end
  
  def validate_token(token_id)
    token = Tokenizer.use_token token_id
    session[:uuid] = token.nil? ? nil : token[:uuid]
  end

end
