class SandboxesController < ApplicationController
  before_filter :find_layout, :find_view

  def index
    if @view[:found] && @layout[:found]
      render @view[:found], :layout => @layout[:found]
    else
      render 'default/default', :layout => "default"
    end
  end

  private

  def find_layout
    @layout = {}
    @layout[:requested] = params[:layout] || "default"
    @layout[:requested_path] = "views/layouts/#{@layout[:requested]}.html.erb"
    @layout[:found] =  template_exists?(@layout[:requested], [:layouts]) ? @layout[:requested] : "default"
  end

  def find_view
    @view = {}
    @view[:requested] = params[:view] || "default"
    @view[:requested_path] = "views/#{@layout[:requested]}/#{@view[:requested]}.html.erb"
    @view[:found] = template_exists?(@view[:requested], [@layout[:requested]]) ? "#{@layout[:requested]}/#{@view[:requested]}" : 'default/default'
  end

end
