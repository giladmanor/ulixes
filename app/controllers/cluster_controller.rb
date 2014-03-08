class ClusterController < AdminController
  
  def show
    @cluster = params[:id].present? ? @account.clusters.find(params[:id]) : Cluster.new(params[:cluster])
    @require = require_statement
  end
  
  def set
    @cluster = params[:id].present? ? @account.clusters.find(params[:id]) : Cluster.new
    @cluster.name=params[:name]
    @cluster.require = params[:require].reject{|r| r.empty?}
    @account.clusters << @cluster
    @require = require_statement
    render :show, :id=>@cluster.id
  end
  
  def require_statement
    operands = {"is"=>[],"not"=>[], "grater then"=>[],"lesser then"=>[]}
    regexp = {"starts with"=>[],"end_with"=>[], "contains"=>[],"equals"=>[],"expression"=>[]}
    
    scales = {}
    @account.scales.each{|s| scales[s.code]=operands}
    badges =  @account.badges.map{|b| b.name} #terminating Array
    value_type = {"with Value"=>operands,"with Value Sum"=>operands, "with Code"=>regexp}
    { 
      "if user has event"=>value_type,
      "if user has Flag"=>value_type,
      Rule::IF_USER_SCALE=>scales,
      Rule::IF_USER_HAS_BADGE=>badges,
      Rule::UNLESS_USER_HAS_BADGE=>badges
    }
  end
  
end
