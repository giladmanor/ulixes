class VisualAidController < AdminController
  
  def index
    
  end
  
  def show
    render params[:id]
  end
  
  
end
