class ApiController < ApplicationController
  before_filter :auth_filter, :except=>[:use_token]
  after_filter :callback_wrapper #JSONP wrapper
  respond_to :json
  
  SUCCESS = {:success=>true}
  FAIL = {:success=>false}
  
  def get_token
    respond_with(generate_token)
  end
  
  def use_token
    respond_with(validate_token)
  end
  
  def get
    respond_with(@user)
  end
  
  def set
    @user.resolve_action params[:code],params[:value]
    params[:with_info].present? ? respond_with(@user) : respond_with(SUCCESS)
  end
  
  private # private # private # private # private # private # private # private # private # private # 
  
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
  
  def callback_wrapper
    response.body = "#{params[:callback]}(#{response.body});" unless params[:callback].nil?
  end

end
